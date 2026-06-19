/**
 * GoHighLevel integration stub.
 *
 * The Method ecosystem uses GoHighLevel for CRM, opportunity creation, and
 * booking workflows. This module shapes the data we collect from the customer
 * quote builder into the payload GHL expects.
 *
 * The current implementation logs the payload and resolves successfully so we
 * can ship UI confidently. To go live, replace `dispatch` with an actual
 * fetch() call to either:
 *   - a GHL inbound webhook (preferred for low-config installs), or
 *   - the GHL v2 API: POST /contacts/  + POST /opportunities/
 *
 * Endpoints / API keys should be loaded from environment variables
 * (VITE_GHL_WEBHOOK_URL, VITE_GHL_API_KEY) — never hard-coded.
 */

const PIPELINE = {
  // Names are illustrative — confirm with whoever owns the GHL account.
  newQuotes: 'method-hvac-new-quotes',
  stages: {
    submitted: 'quote-submitted',
    contacted: 'contact-attempted',
    booked: 'site-visit-booked',
    won: 'install-booked',
    lost: 'lost',
  },
};

/**
 * Build the contact payload from the customer step.
 */
export const buildContactPayload = (contact) => ({
  firstName: contact?.firstName?.trim() || '',
  lastName: contact?.lastName?.trim() || '',
  email: contact?.email?.trim().toLowerCase() || '',
  phone: contact?.phone?.trim() || '',
  address1: contact?.address?.trim() || '',
  city: contact?.city?.trim() || '',
  state: 'AB',
  country: 'CA',
  postalCode: contact?.postal?.trim() || '',
  source: 'methodhvac.ca — Build Your Quote',
  tags: ['website-quote', 'method-hvac'],
});

/**
 * Build the opportunity payload from the quote summary.
 */
export const buildOpportunityPayload = (quote, contact) => ({
  pipelineId: PIPELINE.newQuotes,
  stageId: PIPELINE.stages.submitted,
  name: `${contact?.firstName || 'Quote'} ${contact?.lastName || ''} — ${quote?.quoteType || 'service'}`.trim(),
  monetaryValue: quote?.total || 0,
  status: 'open',
  customFields: {
    quoteType: quote?.quoteType,
    homeSize: quote?.homeSizeId,
    tier: quote?.tierId,
    materialSubtotal: quote?.materialSubtotal,
    laborSubtotal: quote?.labor?.subtotal,
    gst: quote?.gst,
    total: quote?.total,
    materialList: (quote?.materials || []).map((m) => `${m.brand} ${m.name} (${m.sku})`).join('; '),
    preferredContactTime: contact?.preferredTime || '',
    notes: contact?.notes || '',
  },
});

/**
 * Dispatch the quote to GoHighLevel (or its stand-in).
 * In production, swap this for a real fetch() and surface error states.
 */
export const submitQuoteToGHL = async ({ quote, contact }) => {
  const payload = {
    contact: buildContactPayload(contact),
    opportunity: buildOpportunityPayload(quote, contact),
    submittedAt: new Date().toISOString(),
  };

  // For now we simulate the round-trip so the rest of the UI can be wired up.
  // Replace the body of this function with a fetch() to your GHL endpoint.
  console.info('[GHL stub] Submitting quote payload →', payload);

  // Simulate latency so the loading state shows up.
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    reference: `MH-${Date.now().toString().slice(-7)}`,
    payload,
  };
};

/**
 * Submit a contact-only form (Contact page) — same shape, no opportunity.
 */
export const submitContactToGHL = async ({ contact, message, subject }) => {
  const payload = {
    contact: {
      ...buildContactPayload(contact),
      tags: ['website-contact', 'method-hvac'],
    },
    note: {
      subject: subject || 'Website contact form',
      body: message || '',
    },
    submittedAt: new Date().toISOString(),
  };

  console.info('[GHL stub] Submitting contact payload →', payload);
  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    success: true,
    reference: `MH-CT-${Date.now().toString().slice(-7)}`,
    payload,
  };
};
