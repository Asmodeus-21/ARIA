// /api/stripe-webhook.js
// Verifies Stripe signature, handles checkout + subscription events,
// and upserts contacts in GoHighLevel with the correct tags.

import Stripe from "stripe";
import getRawBody from "raw-body";

const stripe = new Stripe(process.env.STRIPE_SECRET, { apiVersion: "2023-10-16" });

// Map your price IDs to friendly plan tags used in GHL
const PRICE_TO_PLAN = {
  [process.env.STRIPE_PRICE_TRIAL]:   { key: "trial",   label: "Plan: 99 Trial" },
  [process.env.STRIPE_PRICE_STARTER]: { key: "starter", label: "Plan: 497 Starter" },
  [process.env.STRIPE_PRICE_GROWTH]:  { key: "growth",  label: "Plan: 997 Growth" },
};

const BASE_TAGS = ["Paid Customer", "Stripe"];
const GHL_BASE_URL = "https://services.leadconnectorhq.com";

function parseName(name) {
  if (!name) return { firstName: undefined, lastName: undefined };
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  const firstName = parts.shift();
  const lastName = parts.join(" ");
  return { firstName, lastName };
}

function planInfoFromPriceId(priceId) {
  if (!priceId) return null;
  return PRICE_TO_PLAN[priceId] || null;
}

function planTagsSet() {
  return new Set(Object.values(PRICE_TO_PLAN).map(p => p.label));
}

async function upsertGHLContact({ firstName, lastName, email, phone, addTags = [], removeTags = [] }) {
  if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
    console.error("Missing GHL env vars");
    return { ok: false, error: "Missing GHL env vars" };
  }

  // 1) Upsert contact + add tags
  const upsertPayload = {
    locationId: process.env.GHL_LOCATION_ID,
    email: email || undefined,
    phone: phone || undefined,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    tags: addTags && addTags.length ? addTags : undefined,
  };

  const upsertRes = await fetch(`${GHL_BASE_URL}/contacts/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GHL_API_KEY}`,
      "Version": "2021-07-28",
      "Content-Type": "application/json",
      "Accept": "application/json",
      "LocationId": process.env.GHL_LOCATION_ID,
    },
    body: JSON.stringify(upsertPayload),
  });

  const upsertJson = await upsertRes.json().catch(() => ({}));
  if (!upsertRes.ok) {
    console.error("GHL upsert error", upsertRes.status, upsertJson);
    return { ok: false, error: upsertJson || upsertRes.statusText };
  }

  const contactId = upsertJson?.contact?.id || upsertJson?.id;
  if (!contactId) {
    console.error("GHL upsert missing contact ID", upsertJson);
    return { ok: false, error: "Missing contactId from GHL response" };
  }

  // 2) Remove tags (best-effort) when needed
  if (removeTags && removeTags.length) {
    try {
      const getRes = await fetch(`${GHL_BASE_URL}/contacts/${contactId}`, {
        headers: {
          "Authorization": `Bearer ${process.env.GHL_API_KEY}`,
          "Version": "2021-07-28",
          "Accept": "application/json",
          "LocationId": process.env.GHL_LOCATION_ID,
        },
      });
      const getJson = await getRes.json().catch(() => ({}));
      const currentTags = getJson?.contact?.tags || [];
      const filtered = currentTags.filter(t => !removeTags.includes(t));
      if (filtered.length !== currentTags.length) {
        await fetch(`${GHL_BASE_URL}/contacts/${contactId}`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${process.env.GHL_API_KEY}`,
            "Version": "2021-07-28",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "LocationId": process.env.GHL_LOCATION_ID,
          },
          body: JSON.stringify({ tags: filtered }),
        });
      }
    } catch (e) {
      console.warn("GHL tag removal best-effort failed", e);
    }
  }

  return { ok: true, contactId };
}

async function handleCheckoutCompleted(session) {
  const details = session.customer_details || {};
  const email = details.email || session?.customer_email || null;
  const phone = details.phone || null;
  const name = details.name || null;
  const { firstName, lastName } = parseName(name);

  // Try to read priceId from metadata; fallback to expanded line_items
  let priceId = session?.metadata?.priceId || null;
  if (!priceId) {
    try {
      const full = await stripe.checkout.sessions.retrieve(session.id, { expand: ["line_items.data.price"] });
      priceId = full?.line_items?.data?.[0]?.price?.id || null;
    } catch {}
  }

  const planInfo = planInfoFromPriceId(priceId);
  const planTag = planInfo?.label || null;

  const add = [...BASE_TAGS];
  if (planTag) add.push(planTag, "Checkout Success");

  return upsertGHLContact({
    firstName,
    lastName,
    email,
    phone,
    addTags: add,
  });
}

async function handleSubscriptionEvent(sub) {
  const priceId = sub?.items?.data?.[0]?.price?.id;
  const planInfo = planInfoFromPriceId(priceId);
  const planTag = planInfo?.label || null;

  let email = null, phone = null, name = null;
  try {
    const customer = typeof sub.customer === "string"
      ? await stripe.customers.retrieve(sub.customer)
      : sub.customer;
    email = customer?.email || null;
    phone = customer?.phone || null;
    name = customer?.name || null;
  } catch (e) {
    console.error("Stripe customer fetch failed", e);
  }
  const { firstName, lastName } = parseName(name);

  if (["active", "trialing"].includes(sub.status)) {
    const remove = [...planTagsSet()].filter(t => t !== planTag);
    const add = planTag ? [...BASE_TAGS, planTag] : [...BASE_TAGS];
    return upsertGHLContact({ firstName, lastName, email, phone, addTags: add, removeTags: remove });
  }

  if (["canceled", "unpaid", "incomplete_expired", "paused"].includes(sub.status)) {
    return upsertGHLContact({
      firstName, lastName, email, phone,
      addTags: ["Stripe"],
      removeTags: [...planTagsSet(), "Paid Customer"],
    });
  }

  return { ok: true };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const sig = req.headers["stripe-signature"];
  if (!sig) return res.status(400).json({ error: "Missing Stripe signature" });

  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (e) {
    console.error("Failed to read raw body", e);
    return res.status(400).json({ error: "Invalid body" });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe sig verification failed", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const r = await handleCheckoutCompleted(session);
        if (!r.ok) console.error("GHL upsert failed (checkout.completed)", r.error);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const r = await handleSubscriptionEvent(sub);
        if (!r.ok) console.error("GHL upsert failed (subscription.*)", r.error);
        break;
      }
      default:
        // Ignore other events
        break;
    }
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error("Webhook handler error", e);
    return res.status(500).json({ error: "Webhook handler error" });
  }
}
