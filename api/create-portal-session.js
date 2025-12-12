// /api/create-portal-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET, { apiVersion: "2023-10-16" });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { email, returnUrl } = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    if (!email) return res.status(400).json({ error: "Missing email" });

    const customers = await stripe.customers.search({ query: `email:"${email}"`, limit: 1 });
    const customer = customers?.data?.[0];
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: returnUrl || `${process.env.SITE_URL || "https://ariagroups.xyz"}/`,
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error("create-portal-session error", e);
    return res.status(500).json({ error: "Failed to create portal session" });
  }
}
