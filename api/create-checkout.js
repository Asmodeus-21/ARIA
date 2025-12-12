// api/create-checkout.js

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { priceId, planName } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!priceId) return res.status(400).json({ error: "Missing priceId" });

    const stripe = require("stripe")(process.env.STRIPE_SECRET);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      phone_number_collection: { enabled: true },
      customer_creation: "always",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://ariagroups.xyz/success",
      cancel_url: "https://ariagroups.xyz/canceled",
      metadata: {
        planName: planName || "",         // e.g. Trial/Starter/Growth
        priceId
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error("Stripe Checkout Error:", e);
    return res.status(500).json({ error: e.message });
  }
}
