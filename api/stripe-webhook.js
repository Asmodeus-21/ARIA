// /api/stripe-webhook.js
import Stripe from "stripe";
import getRawBody from "raw-body";

// Vercel/Next API style config: disables body parsing so we can validate the Stripe signature
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2023-10-16",
});

const PRICE_TO_PLAN = {
  [process.env.STRIPE_PRICE_TRIAL]: { key: "trial", label: "Plan: 99 Trial" },
  [process.env.STRIPE_PRICE_STARTER]: { key: "starter", label: "Plan: 497 Starter" },
  [process.env.STRIPE_PRICE_GROWTH]: { key: "growth", label: "Plan: 997 Growth" },
};

const BASE_TAGS = ["Paid Customer", "Stripe"];
const GHL_BASE_URL = "https://services.leadconnectorhq.com"; // LeadConnector PIT base

async function upsertGHLContact({ firstName, lastName, email, phone, addTags = [], removeTags = [] }) {
  if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
    console.error("GHL env missing");
    return { ok: false, error: "Missing GHL env" };
  }

  // Build payload for upsert. Upsert by email if present; phone fallback.
  // Location can go in header and body; we do both for maximum compatibility.
  const payload = {
    locationId: process.env.GHL_LOCATION_ID,
    email: email || undefined,
    phone: phone || undefined,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    tags: addTags && addTags.length ? addTags : undefined,
  };

  // 1) Upsert contact and add tags
  const upsertRes = await fetch(`${GHL_BASE_URL}/contacts/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GHL_API_KEY}`,
      "Version": "2021-07-28",
      "Content-Type": "application/json",
      "Accept": "application/json",
      "LocationId": process.env.GHL_LOCATION_ID,
    },
    body: JSON.stringify(payload),
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

  // 2) Remove tags if requested (for plan changes/cancellation)
  if (removeTags && removeTags.length) {
    try {
      // GHL doesn’t have a single bulk “remove tags by name” endpoint across all accounts,
      // so safest approach: PATCH contact with tags array after filtering.
      // Fetch contact to get current tags, then rewrite without removed tags.
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

async function handleCheckoutCompleted(session) {
  // Expand if we didn’t expand in Stripe dashboard; but session here should already have basic customer_details
  const customerDetails = session.customer_details || {};
  const email = customerDetails.email || session?.customer_email || null;
  const phone = customerDetails.phone || null;
  const name = customerDetails.name || null;
  const { firstName, lastName } = parseName(name);

  // Price → Plan tag
  const priceId = session?.metadata?.priceId || session?.display_items?.[0]?.price?.id || null;

  // If not in metadata, pull from line_items
  let _planInfo = planInfoFromPriceId(priceId);
  if (!_planInfo) {
    try {
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, { expand: ["line_items.data.price"] });
      const liPriceId = fullSession?.line_items?.data?.[0]?.price?.id;
      _planInfo = planInfoFromPriceId(liPriceId);
    } catch {}
  }

  const planTag = _planInfo?.label;
  const addTags = [...BASE_TAGS];
  if (planTag) addTags.push(planTag, "Checkout Success");

  return upsertGHLContact({
    firstName,
    lastName,
    email,
    phone,
    addTags,
  });
}

function planTagsSet() {
  // All possible plan tags we may need to clean up during upgrade/downgrade
  return new Set(Object.values(PRICE_TO_PLAN).map(p => p.label));
}

async function handleSubscriptionEvent(sub) {
  // subscription has items; pick first price as plan indicator
  const priceId = sub?.items?.data?.[0]?.price?.id;
  const planInfo = planInfoFromPriceId(priceId);
  const planTag = planInfo?.label || null;

  // Fetch the customer to get email/phone/name
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

  // On status = active/trialing → ensure Paid Customer + planTag present, remove other plan tags
  if (["active", "trialing"].includes(sub.status)) {
    const remove = [...planTagsSet()].filter(t => t !== planTag);
    const addTags = planTag ? [...BASE_TAGS, planTag] : [...BASE_TAGS];

    return upsertGHLContact({
      firstName,
      lastName,
      email,
      phone,
      addTags,
      removeTags: remove,
    });
  }

  // On canceled/unpaid/incomplete_expired → remove plan tags, keep Stripe tag to show history
  if (["canceled", "unpaid", "incomplete_expired", "paused"].includes(sub.status)) {
    return upsertGHLContact({
      firstName,
      lastName,
      email,
      phone,
      addTags: ["Stripe"], // keep a minimal audit tag
      removeTags: [...planTagsSet(), "Paid Customer"],
    });
  }

  // Any other state: no-op
  return { ok: true };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const sig = req.headers["stripe-signature"];
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
    console.error("Stripe signature verification failed", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const result = await handleCheckoutCompleted(session);
        if (!result.ok) console.error("GHL upsert failed (checkout.completed)", result.error);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const result = await handleSubscriptionEvent(sub);
        if (!result.ok) console.error("GHL upsert failed (subscription.*)", result.error);
        break;
      }
      default:
        // Ignore the 900 other Stripe events we don’t care about
        break;
    }

    // Stripe wants a 2xx quickly
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error("Webhook handler exception", e);
    return res.status(500).json({ error: "Webhook handler error" });
  }
}
