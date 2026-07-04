const CRM_ENDPOINT = 'https://crm.methodz.ca/api/webhooks/lead'

function text(value) {
  return value?.toString().trim() ?? ''
}

function normalizeContact(contact = {}) {
  return {
    name: text(contact.name),
    email: text(contact.email).toLowerCase(),
    phone: text(contact.phone),
    postalCode: text(contact.postalCode).toUpperCase(),
    address: text(contact.address),
    preferredContact: text(contact.preferredContact) || 'Phone call',
    urgency: text(contact.urgency) || 'Need help this week',
    timeline: text(contact.timeline) || 'As soon as possible',
    notes: text(contact.notes),
  }
}

function createLeadId(date = new Date()) {
  const day = date.toISOString().slice(0, 10).replaceAll('-', '')
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `MHVAC-${day}-${suffix}`
}

function sanitizeUrl(url) {
  try {
    const parsed = new URL(url)
    return parsed.href
  } catch {
    return ''
  }
}

function normalizeBody(rawBody) {
  if (!rawBody) {
    return {}
  }

  if (typeof rawBody === 'string') {
    try {
      return JSON.parse(rawBody)
    } catch {
      return {}
    }
  }

  return rawBody
}

function validateLead(lead) {
  const errors = []

  if (!lead.contact.name) {
    errors.push('contact.name is required')
  }

  if (!lead.contact.email && !lead.contact.phone) {
    errors.push('contact.email or contact.phone is required')
  }

  if (!lead.serviceType) {
    errors.push('serviceType is required')
  }

  return errors
}

function buildLeadRecord(body) {
  const payload = body.payload ?? {}
  const payloadCrm = payload.crm ?? {}
  const incomingCrm = body.crm ?? {}
  const now = new Date().toISOString()
  const contact = normalizeContact(body.contact ?? payload.contact)
  const crm = {
    pipeline: 'Method HVAC Home Comfort Pipeline',
    stage: 'new_quote_request',
    leadStatus: 'accepted_by_website',
    ownerQueue: 'method-hvac-coordinator',
    ...payloadCrm,
    ...incomingCrm,
  }

  return {
    leadId: createLeadId(),
    brand: text(body.brand) || 'method_hvac',
    source: text(body.source) || payload.source || 'method_hvac_website',
    serviceType: text(body.serviceType) || payload.quote?.service || 'hvac_quote_request',
    receivedAt: now,
    submittedAt: text(body.submittedAt) || payload.submittedAt || now,
    pageUrl: sanitizeUrl(body.pageUrl),
    contact,
    estimate: body.estimate ?? {},
    quote: payload.quote ?? {},
    crm,
    workflow: body.workflow ?? payload.workflow ?? {},
    payload,
    audit: {
      acceptedBy: 'method-hvac-website-api',
      schemaVersion: payload.schemaVersion ?? '1.0',
      integrationTarget: payload.integrationTarget ?? 'GoHighLevel',
      webhookEndpoint: CRM_ENDPOINT,
    },
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = process.env.METHODZ_CRM_WEBHOOK_SECRET

  if (!secret) {
    return res.status(500).json({ error: 'CRM webhook secret is not configured' })
  }

  const leadRecord = buildLeadRecord(normalizeBody(req.body))
  const validationErrors = validateLead(leadRecord)

  if (validationErrors.length > 0) {
    return res.status(400).json({
      accepted: false,
      errors: validationErrors,
    })
  }

  try {
    const response = await fetch(CRM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-methodz-crm-secret': secret,
      },
      body: JSON.stringify(leadRecord),
    })

    const responseText = await response.text()

    if (!response.ok) {
      return res.status(response.status).json({
        accepted: false,
        leadId: leadRecord.leadId,
        error: 'CRM webhook rejected lead',
        upstreamStatus: response.status,
        upstreamMessage: responseText.slice(0, 2000),
      })
    }

    return res.status(202).json({
      accepted: true,
      leadId: leadRecord.leadId,
      crm: {
        pipeline: leadRecord.crm.pipeline,
        stage: leadRecord.crm.stage,
        priority: leadRecord.crm.priority,
        priorityLabel: leadRecord.crm.priorityLabel,
        sla: leadRecord.crm.sla,
      },
      upstreamStatus: response.status,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      accepted: false,
      leadId: leadRecord.leadId,
      error: 'Failed to forward lead to CRM',
    })
  }
}
