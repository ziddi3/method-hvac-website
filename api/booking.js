const DEFAULT_CRM = 'https://crm.methodz.ca'
const DEFAULT_PATH = '/api/webhooks/booking'
const ALLOWED_ORIGINS = [
  'https://method-hvac.ca',
  'https://www.method-hvac.ca',
  'https://hub.methodz.ca',
]

function crmBookingUrl() {
  const configured = String(process.env.CRM_BOOKING_PATH || '').trim()
  if (configured.startsWith('http')) return configured
  const base = String(process.env.CRM_CORE_URL || DEFAULT_CRM).replace(/\/$/, '')
  const pathName = configured || DEFAULT_PATH
  return `${base}${pathName.startsWith('/') ? pathName : `/${pathName}`}`
}

function setCors(req, res) {
  const origin = req.headers.origin || ''
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  res.setHeader('Access-Control-Allow-Origin', allow)
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-methodz-crm-secret')
}

export default async function handler(req, res) {
  setCors(req, res)
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {}
  const payload = {
    ...body,
    source: body.source || 'method-hvac.ca',
    destination: body.destination || 'Method HVAC desk — Franco and Charles',
  }

  const headers = { 'Content-Type': 'application/json' }
  if (process.env.METHODZ_CRM_WEBHOOK_SECRET) {
    headers['x-methodz-crm-secret'] = process.env.METHODZ_CRM_WEBHOOK_SECRET
  }

  try {
    const upstream = await fetch(crmBookingUrl(), {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })
    const text = await upstream.text()
    let parsed = text
    try {
      parsed = JSON.parse(text)
    } catch {
      /* keep text */
    }
    res.status(upstream.status).json(
      typeof parsed === 'object' && parsed ? parsed : { ok: upstream.ok, raw: parsed },
    )
  } catch (error) {
    res.status(502).json({
      error: 'CRM booking forward failed',
      details: error instanceof Error ? error.message : 'unknown',
    })
  }
}
