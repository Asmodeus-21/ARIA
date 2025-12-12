// /api/create-checkout.js

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2023-10-16",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Support both raw string and parsed JSON bodies
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { priceId, planName } = body;

    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    const siteUrl = process.env.SITE_URL || "https://ariagroups.xyz";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],

      // Improve conversion + data quality
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },

      // Always create a Stripe customer so webhooks can hydrate contact details
      customer_creation: undefined,


      // Extra context for the webhook → GHL
      metadata: {
        planName: planName || "",
        priceId,
        source: "Aria Website",
      },

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
