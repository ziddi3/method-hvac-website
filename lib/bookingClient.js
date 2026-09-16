const CRM_BOOKING_URL = 'https://crm.methodz.ca/api/webhooks/booking'

export function publicBookingPayload({ contact = {}, quote = {}, member = {} } = {}) {
  return {
    source: 'method-hvac.ca',
    channel: 'WEB_FORM',
    campaignId: 'camp_hvac_yyc',
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    city: contact.address,
    postalCode: contact.postalCode,
    service: quote.service || quote.serviceLabel,
    message: contact.notes,
    consent: true,
    memberRateApplied: Boolean(member.applied),
    memberCode: member.code || '',
    destination: 'Method HVAC desk — Franco and Charles',
  }
}

export async function submitHvacBooking(input) {
  const payload = publicBookingPayload(input)
  const endpoints = ['/api/booking', CRM_BOOKING_URL]
  const errors = []

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        errors.push(`${url}: ${data.error || res.status}`)
        continue
      }
      return { ok: true, endpoint: url, ...data }
    } catch (error) {
      errors.push(`${url}: ${error instanceof Error ? error.message : 'failed'}`)
    }
  }

  throw new Error(errors.join(' | ') || 'Booking unavailable')
}
