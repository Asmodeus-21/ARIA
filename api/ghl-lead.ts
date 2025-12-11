// /api/ghl-lead.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Minimal, safe lead capture:
 * - Upserts a Contact in GHL (LeadConnector API)
 * - Adds a tag (from payload or env GHL_DEFAULT_TAG)
 * - Saves "message" as a Contact Note (no need for a custom field)
 * - CORS restricted to your domain(s)
 *
 * Required envs:
 *   GHL_API_KEY        = <pit-0f5c8054-e7fe-410d-a53e-ba26760e4702>
 *   GHL_LOCATION_ID    = oNyEJIUPpvJmXIKBtt3u
 * Optional:
 *   GHL_DEFAULT_TAG    = website
 */

const ALLOWED_ORIGINS = [
  'https://ariagroups.xyz',
  'https://www.ariagroups.xyz',
  'http://localhost:5173', // local dev
];

function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', allowed);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    return res.status(500).json({ error: 'Server not configured: missing env vars' });
  }

  try {
    const {
      // common website fields — send any/all of these from your form
      name,
      firstName,
      lastName,
      email,
      phone,
      company,
      message,
      tags,          // string or string[]
      source,        // e.g. "Website"
      pageUrl,       // optional: where the form was submitted
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
    } = (req.body || {}) as Record<string, any>;

    // basic validation: at least one point of contact
    if (!email && !phone) {
      return res.status(400).json({ error: 'Provide at least email or phone' });
    }

    // derive names safely
    const [derivedFirst, ...rest] = (name || firstName || '').toString().trim().split(' ');
    const derivedLast = (lastName || rest.join(' ')).trim();

    // tags normalize
    const defaultTag = process.env.GHL_DEFAULT_TAG ? [process.env.GHL_DEFAULT_TAG] : [];
    const incomingTags = Array.isArray(tags)
      ? tags
      : (typeof tags === 'string' && tags.trim() ? [tags.trim()] : []);
    const finalTags = [...defaultTag, ...incomingTags].filter(Boolean);

    // 1) Upsert Contact
    const contactPayload: any = {
      locationId,
      source: source || 'Website',
      email,
      phone,
      firstName: derivedFirst || '',
      lastName: derivedLast || '',
      companyName: company || undefined,
      tags: finalTags.length ? finalTags : undefined,
      // If you later add a real custom field for message, we can map it by ID here.
    };

    const contactResp = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Version': '2021-07-28',
      },
      body: JSON.stringify(contactPayload),
    });

    const contactData = await contactResp.json();
    if (!contactResp.ok) {
      console.error('GHL contact error:', contactData);
      return res.status(contactResp.status).json({ error: 'GHL contact failed', details: contactData });
    }

    const contactId =
      contactData?.contact?.id ||
      contactData?.id; // some responses return top-level id

    // 2) Save message as a Note (safer than relying on a custom field)
    if (contactId && (message || pageUrl || utm_source || utm_medium || utm_campaign)) {
      const noteLines = [
        message ? `Message: ${message}` : null,
        pageUrl ? `Page URL: ${pageUrl}` : null,
        utm_source ? `UTM Source: ${utm_source}` : null,
        utm_medium ? `UTM Medium: ${utm_medium}` : null,
        utm_campaign ? `UTM Campaign: ${utm_campaign}` : null,
        utm_term ? `UTM Term: ${utm_term}` : null,
        utm_content ? `UTM Content: ${utm_content}` : null,
        req.headers['user-agent'] ? `UA: ${req.headers['user-agent']}` : null,
        req.headers['x-forwarded-for'] ? `IP: ${String(req.headers['x-forwarded-for']).split(',')[0].trim()}` : null,
      ].filter(Boolean);

      if (noteLines.length) {
        const noteResp = await fetch('https://services.leadconnectorhq.com/notes/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Version': '2021-07-28',
          },
          body: JSON.stringify({
            locationId,
            contactId,
            body: noteLines.join('\n'),
          }),
        });

        if (!noteResp.ok) {
          console.error('GHL note error:', await noteResp.text());
          // don’t fail the whole request if note creation fails
        }
      }
    }

    return res.status(200).json({ ok: true, contactId, contact: contactData });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
