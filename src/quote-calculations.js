const formatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 0,
})

const homeSizes = {
  compact: { label: 'Up to 1,200 sq. ft.', multiplier: 1 },
  family: { label: '1,200 to 2,000 sq. ft.', multiplier: 1.08 },
  large: { label: '2,000 to 3,000 sq. ft.', multiplier: 1.18 },
  estate: { label: '3,000+ sq. ft.', multiplier: 1.3 },
}

const packageTiers = {
  budget: {
    label: 'Budget',
    summary: 'Entry-point scope focused on reliable performance and essential upgrades.',
  },
  standard: {
    label: 'Standard',
    summary: 'Balanced efficiency and comfort for the typical long-term homeowner.',
  },
  premium: {
    label: 'Premium',
    summary: 'Higher-end efficiency, controls, and warranty expectations.',
  },
}

const services = {
  'ac-install': {
    label: 'Air conditioner installation',
    description:
      'Estimate includes condenser equipment planning, labour coordination, and materials for common residential retrofits.',
    assumptions: [
      'Estimate assumes existing electrical service is adequate for the selected equipment.',
      'Final scope may adjust if line-set routing or pad work is more complex than typical.',
    ],
    spreadRate: 0.09,
    packages: {
      budget: { equipment: 4100, labour: 1700, materials: 900 },
      standard: { equipment: 5400, labour: 2000, materials: 1100 },
      premium: { equipment: 7200, labour: 2300, materials: 1350 },
    },
  },
  'furnace-install': {
    label: 'Furnace installation',
    description:
      'Estimate includes furnace equipment, install labour, fittings, venting, and startup allowances for a typical Alberta replacement.',
    assumptions: [
      'Estimate assumes standard replacement access and existing ductwork in serviceable condition.',
      'Additional gas, venting, or controls work may change the final scope after site review.',
    ],
    spreadRate: 0.08,
    packages: {
      budget: { equipment: 4600, labour: 1900, materials: 1100 },
      standard: { equipment: 6200, labour: 2250, materials: 1300 },
      premium: { equipment: 8100, labour: 2600, materials: 1600 },
    },
  },
  'service-repair': {
    label: 'Service and repair',
    description:
      'Estimate is designed for a diagnostic visit plus common repair parts and labour, with final repair approval completed on site.',
    assumptions: [
      'Repair totals vary most when specialty parts or after-hours service are required.',
      'If the failed component makes replacement more economical, we will present installation options before proceeding.',
    ],
    spreadRate: 0.12,
    packages: {
      budget: { equipment: 0, labour: 260, materials: 180 },
      standard: { equipment: 0, labour: 380, materials: 320 },
      premium: { equipment: 0, labour: 540, materials: 520 },
    },
  },
  maintenance: {
    label: 'Maintenance',
    description:
      'Estimate covers a planned maintenance visit with varying levels of inspection depth, consumables, and tune-up allowances.',
    assumptions: [
      'Maintenance pricing assumes equipment is safe to service and accessible during a normal daytime visit.',
      'Repairs discovered during the tune-up are quoted separately before any extra work is completed.',
    ],
    spreadRate: 0.07,
    packages: {
      budget: { equipment: 0, labour: 180, materials: 45 },
      standard: { equipment: 0, labour: 260, materials: 95 },
      premium: { equipment: 0, labour: 360, materials: 160 },
    },
  },
}

const priorityProfiles = {
  urgent: {
    label: 'Urgent dispatch review',
    sla: 'Call or text within 15 minutes during service hours.',
    nextAction: 'Confirm safety, equipment status, and fastest available diagnostic window.',
  },
  high: {
    label: 'High-priority sales follow-up',
    sla: 'Call within 2 business hours.',
    nextAction: 'Confirm scope, access, comfort goals, and appointment availability.',
  },
  standard: {
    label: 'Standard quote follow-up',
    sla: 'Reply by the next business day.',
    nextAction: 'Validate estimate assumptions and offer the next practical booking window.',
  },
  nurture: {
    label: 'Planning nurture',
    sla: 'Send planning reply within 2 business days.',
    nextAction: 'Share comparison guidance, maintenance options, or seasonal planning notes.',
  },
}

const serviceTags = {
  'ac-install': 'ac-installation',
  'furnace-install': 'furnace-installation',
  'service-repair': 'repair-diagnostics',
  maintenance: 'maintenance',
}

function roundToNearestFifty(amount) {
  return Math.round(amount / 50) * 50
}

function roundToCurrency(amount) {
  return Math.round(amount)
}

function createRange(baseAmount, spreadRate) {
  const low = roundToNearestFifty(baseAmount * (1 - spreadRate))
  const high = roundToNearestFifty(baseAmount * (1 + spreadRate))
  return { low, high }
}

function addRanges(...ranges) {
  return ranges.reduce(
    (total, range) => ({
      low: total.low + range.low,
      high: total.high + range.high,
    }),
    { low: 0, high: 0 },
  )
}

function calculateTaxRange(range, rate) {
  return {
    low: roundToCurrency(range.low * rate),
    high: roundToCurrency(range.high * rate),
  }
}

function cleanText(value) {
  return value?.toString().trim() ?? ''
}

function slugify(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function normalizeContact(contact = {}) {
  return {
    name: cleanText(contact.name),
    email: cleanText(contact.email),
    phone: cleanText(contact.phone),
    postalCode: cleanText(contact.postalCode).toUpperCase(),
    address: cleanText(contact.address),
    preferredContact: cleanText(contact.preferredContact) || 'Phone call',
    urgency: cleanText(contact.urgency) || 'Need help this week',
    timeline: cleanText(contact.timeline) || 'As soon as possible',
    notes: cleanText(contact.notes),
  }
}

function calculateLeadScore(contact, estimate) {
  const urgency = contact.urgency.toLowerCase()
  const timeline = contact.timeline.toLowerCase()
  let score = 50

  if (urgency.includes('emergency') || urgency.includes('no heat') || urgency.includes('no cooling')) {
    score += 30
  } else if (urgency.includes('week')) {
    score += 15
  } else if (urgency.includes('planning')) {
    score -= 8
  }

  if (timeline.includes('soon')) {
    score += 15
  } else if (timeline.includes('2 weeks')) {
    score += 10
  } else if (timeline.includes('planning')) {
    score -= 5
  }

  if (estimate.service === 'service-repair') {
    score += 10
  }

  if (estimate.service === 'ac-install' || estimate.service === 'furnace-install') {
    score += 8
  }

  if (estimate.packageTier === 'premium') {
    score += 8
  }

  if (contact.postalCode) {
    score += 5
  }

  return Math.max(0, Math.min(100, score))
}

function determinePriority(score, contact) {
  const urgency = contact.urgency.toLowerCase()

  if (urgency.includes('emergency') || urgency.includes('no heat') || urgency.includes('no cooling')) {
    return 'urgent'
  }

  if (score >= 82) {
    return 'high'
  }

  if (score >= 58) {
    return 'standard'
  }

  return 'nurture'
}

function createLeadTags({ selections, contact, priority }) {
  return [
    'method-hvac',
    'quote-builder',
    serviceTags[selections.service] ?? 'hvac-lead',
    `package-${slugify(selections.packageTier)}`,
    `home-${slugify(selections.homeSize)}`,
    `priority-${priority}`,
    contact.postalCode ? `postal-${slugify(contact.postalCode)}` : '',
    contact.preferredContact ? `contact-${slugify(contact.preferredContact)}` : '',
  ].filter(Boolean)
}

function createNextActions(priority, estimate, contact) {
  const actions = [priorityProfiles[priority].nextAction]

  if (estimate.service === 'service-repair') {
    actions.push('Ask for equipment age, error codes, photos, and whether heat/cooling is fully down.')
  }

  if (estimate.service === 'ac-install' || estimate.service === 'furnace-install') {
    actions.push('Confirm home access, current equipment size, panel/venting notes, and preferred install timing.')
  }

  if (contact.notes) {
    actions.push('Review customer notes before first contact so the coordinator reply is specific.')
  }

  actions.push('Log outcome in CRM, assign owner, and schedule the next follow-up before closing the task.')

  return actions
}

export function getQuoteMetadata() {
  return {
    homeSizes,
    packageTiers,
    services,
    priorityProfiles,
  }
}

export function formatCurrency(amount) {
  return formatter.format(amount)
}

export function formatRange(range) {
  return `${formatCurrency(range.low)} to ${formatCurrency(range.high)}`
}

export function calculateQuote({ service = 'ac-install', packageTier = 'standard', homeSize = 'family' }) {
  const serviceConfig = services[service] ?? services['ac-install']
  const packageConfig = serviceConfig.packages[packageTier] ?? serviceConfig.packages.standard
  const sizeConfig = homeSizes[homeSize] ?? homeSizes.family

  const scaledEquipment = packageConfig.equipment * sizeConfig.multiplier
  const scaledLabour = packageConfig.labour * sizeConfig.multiplier
  const scaledMaterials = packageConfig.materials * sizeConfig.multiplier

  const equipmentRange = createRange(scaledEquipment, serviceConfig.spreadRate * 0.9)
  const labourRange = createRange(scaledLabour, serviceConfig.spreadRate)
  const materialRange = createRange(scaledMaterials, serviceConfig.spreadRate * 1.1)
  const subtotalRange = addRanges(equipmentRange, labourRange, materialRange)
  const gstRange = calculateTaxRange(subtotalRange, 0.05)
  const totalRange = addRanges(subtotalRange, gstRange)

  return {
    service,
    packageTier,
    homeSize,
    serviceLabel: serviceConfig.label,
    packageLabel: packageTiers[packageTier]?.label ?? packageTiers.standard.label,
    homeSizeLabel: sizeConfig.label,
    description: serviceConfig.description,
    packageSummary: packageTiers[packageTier]?.summary ?? packageTiers.standard.summary,
    equipmentRange,
    labourRange,
    materialRange,
    subtotalRange,
    gstRange,
    totalRange,
    assumptions: [...serviceConfig.assumptions],
  }
}

export function createLeadPayload({ selections = {}, contact = {} } = {}, estimate) {
  const normalizedSelections = {
    service: selections.service ?? 'ac-install',
    packageTier: selections.packageTier ?? 'standard',
    homeSize: selections.homeSize ?? 'family',
  }
  const normalizedEstimate = estimate ?? calculateQuote(normalizedSelections)
  const normalizedContact = normalizeContact(contact)
  const score = calculateLeadScore(normalizedContact, normalizedEstimate)
  const priority = determinePriority(score, normalizedContact)
  const priorityProfile = priorityProfiles[priority]
  const tags = createLeadTags({
    selections: normalizedSelections,
    contact: normalizedContact,
    priority,
  })

  return {
    schemaVersion: '1.1',
    source: 'method-hvac-website-quote-builder',
    integrationTarget: 'GoHighLevel',
    integrationStatus: 'ready-for-api-connection',
    submittedAt: new Date().toISOString(),
    contact: normalizedContact,
    crm: {
      pipeline: 'Method HVAC Home Comfort Pipeline',
      stage: 'new_quote_request',
      leadStatus: 'new',
      ownerQueue: 'method-hvac-coordinator',
      priority,
      priorityLabel: priorityProfile.label,
      score,
      sla: priorityProfile.sla,
      nextAction: priorityProfile.nextAction,
      nextActions: createNextActions(priority, normalizedEstimate, normalizedContact),
      opportunityName: `${normalizedContact.name || 'New HVAC lead'} — ${normalizedEstimate.serviceLabel}`,
      opportunityValueRange: normalizedEstimate.totalRange,
      tags,
      customFields: {
        serviceType: normalizedEstimate.serviceLabel,
        packageTier: normalizedEstimate.packageLabel,
        homeSize: normalizedEstimate.homeSizeLabel,
        preferredContact: normalizedContact.preferredContact,
        urgency: normalizedContact.urgency,
        estimatedLow: normalizedEstimate.totalRange.low,
        estimatedHigh: normalizedEstimate.totalRange.high,
      },
    },
    workflow: {
      currentStep: 'lead_captured',
      nextStep: 'coordinator_qualification',
      milestones: [
        'Lead captured from quote builder',
        'Coordinator validates urgency and scope',
        'Appointment or estimate review is scheduled',
        'Job outcome and follow-up are logged in CRM',
      ],
    },
    quote: {
      service: normalizedSelections.service,
      serviceLabel: normalizedEstimate.serviceLabel,
      packageTier: normalizedSelections.packageTier,
      packageLabel: normalizedEstimate.packageLabel,
      homeSize: normalizedSelections.homeSize,
      homeSizeLabel: normalizedEstimate.homeSizeLabel,
      equipmentAllowance: normalizedEstimate.equipmentRange,
      labourAllowance: normalizedEstimate.labourRange,
      materialAllowance: normalizedEstimate.materialRange,
      gst: normalizedEstimate.gstRange,
      totalEstimate: normalizedEstimate.totalRange,
    },
  }
}
