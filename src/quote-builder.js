import {
  calculateQuote,
  createLeadPayload,
  formatRange,
  getQuoteMetadata,
} from './quote-calculations.js'

const { services, packageTiers, homeSizes } = getQuoteMetadata()

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
    timeline: data.get('timeline')?.toString().trim() ?? '',
    notes: data.get('notes')?.toString().trim() ?? '',
  }
}

function fillList(listElement, items) {
  if (!listElement) {
    return
  }

  listElement.innerHTML = items.map((item) => `<li>${item}</li>`).join('')
}

function updateEstimate(form, estimate) {
  const selections = getSelections(form)
  const payloadField = form.querySelector('[name="leadPayload"]')

  const textFields = [
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
  ]

  textFields.forEach(([selector, value]) => {
    const element = document.querySelector(selector)

    if (element) {
      element.textContent = value
    }
  })

  fillList(
    document.querySelector('[data-assumptions-list]'),
    estimate.assumptions.concat(
      `${services[selections.service].label} pricing is based on a ${packageTiers[selections.packageTier].label.toLowerCase()} package for ${homeSizes[selections.homeSize].label.toLowerCase()}.`,
    ),
  )

  if (payloadField) {
    payloadField.value = JSON.stringify(
      createLeadPayload(
        {
          selections,
          contact: getContactDetails(form),
        },
        estimate,
      ),
      null,
      2,
    )
  }
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

  if (!form) {
    return
  }

  const stepPanels = [...form.querySelectorAll('[data-step-panel]')]
  const stepPills = [...form.querySelectorAll('[data-step-pill]')]
  const status = form.querySelector('[data-quote-status]')
  let activeStep = 0

  const syncEstimate = () => {
    const estimate = calculateQuote(getSelections(form))
    updateEstimate(form, estimate)
    return estimate
  }

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

  form.addEventListener('input', syncEstimate)
  form.addEventListener('change', syncEstimate)

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    if (!form.reportValidity()) {
      return
    }

    const estimate = syncEstimate()
    const contact = getContactDetails(form)
    const firstName = contact.name.split(' ')[0] || 'there'

    if (status) {
      status.textContent = `Thanks ${firstName} — your ${estimate.serviceLabel.toLowerCase()} estimate request is ready for follow-up. We’ll confirm scope, site conditions, and next steps with you shortly.`
    }
  })

  showStep(stepPanels, stepPills, activeStep)
  syncEstimate()
}
