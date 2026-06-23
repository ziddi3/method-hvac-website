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

export function getQuoteMetadata() {
  return {
    homeSizes,
    packageTiers,
    services,
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

export function createLeadPayload({ selections, contact }, estimate) {
  return {
    schemaVersion: '1.0',
    source: 'method-hvac-website-quote-builder',
    integrationTarget: 'GoHighLevel',
    integrationStatus: 'ready-for-api-connection',
    submittedAt: new Date().toISOString(),
    contact,
    quote: {
      service: selections.service,
      serviceLabel: estimate.serviceLabel,
      packageTier: selections.packageTier,
      packageLabel: estimate.packageLabel,
      homeSize: selections.homeSize,
      homeSizeLabel: estimate.homeSizeLabel,
      equipmentAllowance: estimate.equipmentRange,
      labourAllowance: estimate.labourRange,
      materialAllowance: estimate.materialRange,
      gst: estimate.gstRange,
      totalEstimate: estimate.totalRange,
    },
  }
}
