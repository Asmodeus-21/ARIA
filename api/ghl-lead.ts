import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_ORIGINS = [
  'https://ariagroups.xyz',
  'https://www.ariagroups.xyz',
  'http://localhost:3000',
  'http://localhost:5173',
];

function setCorsHeaders(res: VercelResponse, origin?: string) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res, req.headers.origin as string);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  const endpoint = process.env.GHL_ENDPOINT || 'https://services.leadconnectorhq.com';

  if (!apiKey || !locationId) {
    return res.status(500).json({ 
      error: 'Server not configured',
      details: 'Missing GHL_API_KEY or GHL_LOCATION_ID environment variables'
    });
  }

  try {
    const body = req.body;
    const { 
      name, 
      firstName, 
      lastName, 
      email, 
      phone, 
      company, 
      message, 
      tags, 
      source, 
      pageUrl,
      utm_source, 
      utm_medium, 
      utm_campaign, 
      utm_term, 
      utm_content 
    } = body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Provide at least email or phone' });
    }

    // Derive first and last names
    const derivedFirst = (firstName || (name ? name.toString().trim().split(' ')[0] : '')).trim();
    const derivedLast = (lastName || (name ? name.toString().trim().split(' ').slice(1).join(' ') : '')).trim();

    const defaultTag = process.env.GHL_DEFAULT_TAG ? [process.env.GHL_DEFAULT_TAG] : [];
    const incomingTags = Array.isArray(tags) ? tags : (typeof tags === 'string' && tags.trim() ? [tags.trim()] : []);
    const finalTags = [...defaultTag, ...incomingTags].filter(Boolean);

    // Create contact payload
    const contactPayload: any = {
      locationId,
      source: source || 'Website',
      email,
      phone,
      firstName: derivedFirst || undefined,
      lastName: derivedLast || undefined,
      companyName: company || undefined,
      tags: finalTags.length ? finalTags : undefined
    };

    // Create contact in GHL
    const contactResponse = await fetch(`${endpoint}/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(contactPayload)
    });

    const contactData = await contactResponse.json();

    if (!contactResponse.ok) {
      return res.status(contactResponse.status).json({ 
        error: 'GHL contact creation failed', 
        details: contactData 
      });
    }

    const contactId = contactData?.contact?.id || contactData?.id;

    // Build note with additional context
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

    // Add note if we have content and a contact ID
    if (contactId && noteLines.length > 0) {
      await fetch(`${endpoint}/notes/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Version': '2021-07-28'
        },
        body: JSON.stringify({ 
          locationId, 
          contactId, 
          body: noteLines.join('\n') 
        })
      }).catch((noteError) => {
        console.error('Failed to add note:', noteError);
        // Continue without note
      });
    }

    return res.status(200).json({ 
      ok: true, 
      contactId, 
      contact: contactData 
    });
  } catch (error) {
    console.error('GHL lead error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
