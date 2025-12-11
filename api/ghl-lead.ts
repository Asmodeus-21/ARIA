// /api/ghl-lead.js

const ALLOWED_ORIGINS = [
  'https://ariagroups.xyz',
  'https://www.ariagroups.xyz',
  'http://localhost:5173', // local dev
];

function cors(res, origin) {
  const allow = ALLOWED_ORIGINS.includes(origin || '') ? origin : ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', allow);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
  cors(res, req.headers.origin);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    return res.status(500).json({ error: 'Server not configured: missing env vars' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { name, firstName, lastName, email, phone, company, message, tags, source, pageUrl,
            utm_source, utm_medium, utm_campaign, utm_term, utm_content } = body;

    if (!email && !phone) return res.status(400).json({ error: 'Provide at least email or phone' });

    const derivedFirst = (name || firstName || '').toString().trim().split(' ')[0] || '';
    const derivedLast = lastName || (name ? name.toString().trim().split(' ').slice(1).join(' ') : '');

    const defaultTag = process.env.GHL_DEFAULT_TAG ? [process.env.GHL_DEFAULT_TAG] : [];
    const incomingTags = Array.isArray(tags) ? tags : (typeof tags === 'string' && tags.trim() ? [tags.trim()] : []);
    const finalTags = [...defaultTag, ...incomingTags].filter(Boolean);

    // 1) Upsert Contact
    const contactPayload = {
      locationId,
      source: source || 'Website',
      email,
      phone,
      firstName: derivedFirst,
      lastName: derivedLast,
      companyName: company || undefined,
      tags: finalTags.length ? finalTags : undefined
    };

    const contactResp = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(contactPayload)
    });
    const contactData = await contactResp.json();
    if (!contactResp.ok) return res.status(contactResp.status).json({ error: 'GHL contact failed', details: contactData });

    const contactId = contactData?.contact?.id || contactData?.id;

    // 2) Save message/UTMs as a Note (optional but useful)
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

    if (contactId && noteLines.length) {
      await fetch('https://services.leadconnectorhq.com/notes/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Version': '2021-07-28'
        },
        body: JSON.stringify({ locationId, contactId, body: noteLines.join('\n') })
      }).catch(() => {});
    }

    return res.status(200).json({ ok: true, contactId, contact: contactData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

