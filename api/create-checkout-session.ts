import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe secret key not configured' });
  }

  try {
    const { priceId, planName } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Missing priceId parameter' });
    }

    const siteUrl = process.env.SITE_URL || 'https://ariagroups.xyz';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Improve conversion + data quality
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      phone_number_collection: { 
        enabled: true 
      },
      // Always create a Stripe customer
      customer_creation: 'always',
      // Metadata for tracking
      metadata: {
        planName: planName || '',
        priceId,
        source: 'Aria Website',
      },
      // Post-checkout redirects
      success_url: `${siteUrl}/success.html`,
      cancel_url: `${siteUrl}/canceled.html`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
