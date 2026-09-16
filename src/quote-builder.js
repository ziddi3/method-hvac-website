import {
  calculateQuote,
  createLeadPayload,
  formatRange,
} from './quote-calculations.js'
import { readMemberParams, scaleRange, verifyMemberPass } from '../lib/memberRate.js'
import { submitHvacBooking } from '../lib/bookingClient.js'

function getSelections(form) {
  const data = new FormData(form)
  return {
    service: data.get('service')?.toString() ?? 'ac-install',
    packageTier: data.get('packageTier')?.toString() ?? 'standard',
    homeSize: data.get('homeSize')?.toString() ?? 'family',
  }
}

function getContactDetails(form) {
  const data = new FormData(form)
  return {
    name: data.get('name')?.toString().trim() ?? '',
    email: data.get('email')?.toString().trim() ?? '',
    phone: data.get('phone')?.toString().trim() ?? '',
    postalCode: data.get('postalCode')?.toString().trim() ?? '',
    address: data.get('address')?.toString().trim() ?? '',
    preferredContact: data.get('preferredContact')?.toString().trim() ?? 'Phone call',
    urgency: data.get('urgency')?.toString().trim() ?? 'Need help this week',
    timeline: data.get('timeline')?.toString().trim() ?? '',
    notes: data.get('notes')?.toString().trim() ?? '',
    memberCode: data.get('memberCode')?.toString().trim().toUpperCase() ?? '',
  }
}

function applyMemberDiscount(estimate, member) {
  if (!member?.applied) {
    return { ...estimate, memberRateApplied: false, memberCode: member?.code || '' }
  }
  const factor = 1 - (member.rate || 0.1)
  const equipmentRange = scaleRange(estimate.equipmentRange, factor)
  const labourRange = scaleRange(estimate.labourRange, factor)
  const materialRange = scaleRange(estimate.materialRange, factor)
  const subtotalRange = {
    low: equipmentRange.low + labourRange.low + materialRange.low,
    high: equipmentRange.high + labourRange.high + materialRange.high,
  }
  const gstRange = {
    low: Math.round(subtotalRange.low * 0.05),
    high: Math.round(subtotalRange.high * 0.05),
  }
  return {
    ...estimate,
    equipmentRange,
    labourRange,
    materialRange,
    subtotalRange,
    gstRange,
    totalRange: {
      low: subtotalRange.low + gstRange.low,
      high: subtotalRange.high + gstRange.high,
    },
    memberRateApplied: true,
    memberCode: member.code,
    memberRatePercent: Math.round((member.rate || 0.1) * 100),
    assumptions: [
      ...estimate.assumptions,
      `Methodz member rate ${Math.round((member.rate || 0.1) * 100)}% applied via ${member.mode || 'code'}.`,
    ],
  }
}

function fillList(listElement, items) {
  if (!listElement) return
  listElement.replaceChildren(
    ...items.map((item) => {
      const listItem = document.createElement('li')
      listItem.textContent = item
      return listItem
    }),
  )
}

function setText(selector, value) {
  const element = document.querySelector(selector)
  if (element) element.textContent = value
}

function updateFormStatus(status, message, statusType = 'info') {
  if (!status) return
  status.dataset.status = statusType
  status.textContent = message
}

function clearFormStatus(status) {
  if (!status) return
  delete status.dataset.status
  status.textContent = ''
}

function setSubmitState(form, isSubmitting) {
  const submitButton = form.querySelector('[type="submit"]')
  if (!submitButton) return
  if (!submitButton.dataset.defaultLabel) {
    submitButton.dataset.defaultLabel = submitButton.textContent.trim()
  }
  submitButton.disabled = isSubmitting
  submitButton.textContent = isSubmitting ? 'Sending request...' : submitButton.dataset.defaultLabel
}

function updateEstimate(form, estimate) {
  const selections = getSelections(form)
  const payloadField = form.querySelector('[name="leadPayload"]')
  const payload = createLeadPayload({ selections, contact: getContactDetails(form) }, estimate)
  if (estimate.memberRateApplied) {
    payload.crm.tags = [...(payload.crm.tags || []), 'methodz-member-10']
    payload.crm.customFields = {
      ...payload.crm.customFields,
      memberCode: estimate.memberCode,
      memberRateApplied: true,
    }
    payload.quote.memberRateApplied = true
    payload.quote.memberCode = estimate.memberCode
  }

  ;[
    ['[data-estimate-title]', `${estimate.serviceLabel} — ${estimate.packageLabel}`],
    ['[data-estimate-subtitle]', `${estimate.homeSizeLabel} · ${estimate.packageSummary}`],
    ['[data-selected-service]', estimate.serviceLabel],
    ['[data-selected-home-size]', estimate.homeSizeLabel],
    ['[data-selected-package]', estimate.packageLabel],
    ['[data-selected-description]', estimate.description],
    ['[data-equipment-range]', formatRange(estimate.equipmentRange)],
    ['[data-labour-range]', formatRange(estimate.labourRange)],
    ['[data-material-range]', formatRange(estimate.materialRange)],
    ['[data-subtotal-range]', formatRange(estimate.subtotalRange)],
    ['[data-gst-range]', formatRange(estimate.gstRange)],
    ['[data-total-range]', formatRange(estimate.totalRange)],
  ].forEach(([selector, value]) => setText(selector, value))

  setText('[data-crm-priority]', payload.crm.priorityLabel)
  setText('[data-crm-score]', `${payload.crm.score}/100`)
  setText('[data-crm-sla]', payload.crm.sla)
  setText('[data-crm-next-action]', payload.crm.nextAction)
  setText(
    '[data-member-rate-status]',
    estimate.memberRateApplied
      ? `Methodz member ${estimate.memberRatePercent}% applied (${estimate.memberCode})`
      : 'No Methodz member rate on this quote yet.',
  )

  fillList(
    document.querySelector('[data-assumptions-list]'),
    estimate.assumptions.concat(
      `${estimate.serviceLabel} pricing is based on a ${estimate.packageLabel.toLowerCase()} package for ${estimate.homeSizeLabel.toLowerCase()}.`,
    ),
  )
  fillList(document.querySelector('[data-crm-next-actions]'), payload.crm.nextActions)
  if (payloadField) payloadField.value = JSON.stringify(payload, null, 2)
}

function showStep(stepPanels, stepPills, nextStepIndex) {
  stepPanels.forEach((panel, index) => {
    panel.hidden = index !== nextStepIndex
  })
  stepPills.forEach((pill, index) => {
    pill.classList.toggle('is-active', index === nextStepIndex)
    pill.classList.toggle('is-complete', index < nextStepIndex)
  })
}

export function initializeQuoteBuilder() {
  const form = document.querySelector('[data-quote-form]')
  if (!form) return

  form.method = 'post'
  const stepPanels = [...form.querySelectorAll('[data-step-panel]')]
  const stepPills = [...form.querySelectorAll('[data-step-pill]')]
  const status = form.querySelector('[data-quote-status]')
  const memberField = form.querySelector('[name="memberCode"]')
  let activeStep = 0
  let member = { applied: false, rate: 0, code: '', mode: null }

  const incoming = readMemberParams(window.location.search)
  if (memberField && incoming.code) memberField.value = incoming.code

  const syncEstimate = () => {
    const estimate = applyMemberDiscount(calculateQuote(getSelections(form)), member)
    updateEstimate(form, estimate)
    return estimate
  }

  verifyMemberPass({
    code: incoming.code || memberField?.value,
    token: incoming.token,
    email: incoming.email,
  }).then((result) => {
    member = result
    if (memberField && result.code) memberField.value = result.code
    syncEstimate()
  })

  memberField?.addEventListener('change', async () => {
    member = await verifyMemberPass({
      code: memberField.value,
      token: incoming.token,
      email: incoming.email || getContactDetails(form).email,
    })
    syncEstimate()
  })

  form.querySelectorAll('[data-next-step]').forEach((button) => {
    button.addEventListener('click', () => {
      activeStep = Math.min(activeStep + 1, stepPanels.length - 1)
      showStep(stepPanels, stepPills, activeStep)
      syncEstimate()
    })
  })

  form.querySelectorAll('[data-prev-step]').forEach((button) => {
    button.addEventListener('click', () => {
      activeStep = Math.max(activeStep - 1, 0)
      showStep(stepPanels, stepPills, activeStep)
      syncEstimate()
    })
  })

  form.addEventListener('input', () => {
    if (status?.dataset.status === 'success' || status?.dataset.status === 'error') {
      clearFormStatus(status)
    }
    syncEstimate()
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (!form.reportValidity()) return

    const estimate = syncEstimate()
    const contact = getContactDetails(form)
    const firstName = contact.name.split(' ')[0] || 'there'
    const payloadField = form.querySelector('[name="leadPayload"]')

    updateFormStatus(status, 'Sending your estimate request into the Method HVAC CRM workflow...', 'info')
    setSubmitState(form, true)

    try {
      const payload = payloadField?.value ? JSON.parse(payloadField.value) : {}
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: 'method_hvac',
          source: 'method_hvac_website',
          serviceType: payload?.quote?.service ?? 'hvac_quote_request',
          contact,
          estimate,
          crm: payload.crm,
          workflow: payload.workflow,
          payload,
          pageUrl: window.location.href,
          submittedAt: new Date().toISOString(),
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(result.error ?? `CRM webhook failed with ${response.status}`)
      }

      try {
        await submitHvacBooking({ contact, quote: estimate, member })
      } catch (bookingError) {
        console.warn(bookingError)
      }

      updateFormStatus(
        status,
        `Thanks ${firstName} — your ${estimate.serviceLabel.toLowerCase()} request is queued as ${payload.crm.priorityLabel.toLowerCase()}. Method HVAC will follow up based on the ${payload.crm.sla.toLowerCase()}`,
        'success',
      )
    } catch (error) {
      console.error(error)
      updateFormStatus(
        status,
        'Your estimate was calculated, but the CRM connection failed. Please call or email Method HVAC directly so the request is not missed.',
        'error',
      )
    } finally {
      setSubmitState(form, false)
    }
  })

  showStep(stepPanels, stepPills, activeStep)
  syncEstimate()
}
