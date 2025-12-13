// /api/create-checkout.js

import Stripe from "stripe";

const STRIPE_SECRET = process.env.STRIPE_SECRET || process.env.STRIPE_SECRET_KEY || null;
const PRICE_IDS = {
  trial: process.env.STRIPE_PRICE_TRIAL || "price_1SdS2xP5hYPh0Vt1rivOqGnr",
  starter: process.env.STRIPE_PRICE_STARTER || "price_1SdS3pP5hYPh0Vt1WyTaDp0i",
  growth: process.env.STRIPE_PRICE_GROWTH || "price_1SdS4cP5hYPh0Vt1sme5Dtat",
};

const stripe = STRIPE_SECRET
  ? new Stripe(STRIPE_SECRET, { apiVersion: "2023-10-16" })
  : null;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const sanitizeKey = (value) =>
    typeof value === "string" && value.trim() ? value.toLowerCase() : "";

  try {
    // Support both raw string and parsed JSON bodies
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { priceId: bodyPriceId, planName, planKey } = body;

    if (!stripe) {
      console.warn("Stripe secret key is not configured");
      return res.status(500).json({ error: "Stripe secret key is not configured" });
    }

    // planName originates from UI labels (e.g., "Starter", "Growth") and normalizes to plan keys.
    const normalizedPlanKey = sanitizeKey(planKey) || sanitizeKey(planName);

    const resolvedPriceId = bodyPriceId || PRICE_IDS[normalizedPlanKey];

    if (!resolvedPriceId) {
      return res.status(400).json({ error: "Unable to resolve price ID for this plan" });
    }

    const siteUrl = process.env.SITE_URL || "https://ariagroups.xyz";
    const metadata = {
      planName: planName || normalizedPlanKey || "",
      planKey: normalizedPlanKey,
      priceId: resolvedPriceId,
      source: "Aria Website",
    };

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: resolvedPriceId, quantity: 1 }],

      // Improve conversion + data quality
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },

      // Always create a Stripe customer so webhooks can hydrate contact details
      customer_creation: undefined,


      // Extra context for the webhook → GHL
      metadata,

      // Post-checkout redirects
      success_url: `${siteUrl}/success`,
      cancel_url: `${siteUrl}/canceled`,
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error("create-checkout error:", e);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
}
