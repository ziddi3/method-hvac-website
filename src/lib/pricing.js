/**
 * Pricing engine for the customer quote builder.
 *
 * Designed so the same logic can be reused by the internal worker app:
 *  - pure functions, no React imports
 *  - takes plain data (quoteType, tier, homeSize, materials)
 *  - returns a fully-itemized breakdown including labor, GST, and total
 */

import { GST_RATE } from '../config/site.js';
import { getHomeSize } from '../data/homeSizes.js';
import { getTier } from '../data/packages.js';
import { round2 } from './format.js';

/** Hourly labour rate in CAD. */
export const LABOR_HOURLY_RATE = 145;

/** Service / repair labour structure (diagnostic, hour rates). */
export const SERVICE_PRICING = {
  diagnosticFee: 89,
  minHours: 1,
  hourlyRate: 165,
};

/** Maintenance plan tiers — simple, transparent annual pricing. */
export const MAINTENANCE_PLANS = [
  {
    id: 'maint-furnace',
    name: 'Furnace Care',
    price: 199,
    description: 'Annual furnace tune-up, safety inspection, and combustion analysis.',
    perks: [
      '1 annual furnace tune-up (60-point inspection)',
      'Combustion analysis + carbon monoxide test',
      '10% off any repair parts',
      'Email reminder when your tune-up is due',
    ],
  },
  {
    id: 'maint-ac',
    name: 'Cooling Care',
    price: 199,
    description: 'Annual AC tune-up, refrigerant check, and condenser coil cleaning.',
    perks: [
      '1 annual AC tune-up (45-point inspection)',
      'Refrigerant level + leak check',
      'Condenser coil cleaning',
      '10% off any repair parts',
    ],
  },
  {
    id: 'maint-complete',
    name: 'Complete Comfort',
    price: 329,
    description: 'Furnace + AC tune-ups, priority dispatch, parts discount, and free filters.',
    perks: [
      'Both furnace and AC annual tune-ups',
      '15% off any repair parts',
      'Priority dispatch during cold snaps',
      'Free 4" media filter delivered annually',
      'No after-hours diagnostic fees',
    ],
    badge: 'Most popular',
  },
];

export const getMaintenancePlan = (id) => MAINTENANCE_PLANS.find((p) => p.id === id);

/**
 * Compute labour for an install quote.
 * Labour hours = baseLaborHours (from home size) × tier.laborMultiplier
 */
export const computeInstallLabor = ({ homeSizeId, tierId }) => {
  const homeSize = getHomeSize(homeSizeId);
  const tier = getTier(tierId);
  if (!homeSize || !tier) return { hours: 0, rate: LABOR_HOURLY_RATE, subtotal: 0 };

  const hours = round2(homeSize.baseLaborHours * tier.laborMultiplier);
  const subtotal = round2(hours * LABOR_HOURLY_RATE);
  return { hours, rate: LABOR_HOURLY_RATE, subtotal };
};

/**
 * Compute a full install quote (AC or furnace).
 * @param {Object} opts
 * @param {string} opts.quoteType    - 'ac-install' | 'furnace-install'
 * @param {string} opts.homeSizeId
 * @param {string} opts.tierId
 * @param {Array}  opts.materials    - array of catalog items selected
 */
export const computeInstallQuote = ({ quoteType, homeSizeId, tierId, materials = [] }) => {
  const materialSubtotal = round2(
    materials.reduce((sum, m) => sum + (Number(m.price) || 0), 0),
  );
  const labor = computeInstallLabor({ homeSizeId, tierId });
  const subtotal = round2(materialSubtotal + labor.subtotal);
  const gst = round2(subtotal * GST_RATE);
  const total = round2(subtotal + gst);

  return {
    quoteType,
    materials,
    materialSubtotal,
    labor,
    subtotal,
    gstRate: GST_RATE,
    gst,
    total,
  };
};

/**
 * Compute a service / repair quote — flat diagnostic + hourly time on top.
 * @param {Object} opts
 * @param {number} opts.estimatedHours  - 1 = quick fix, 2 = standard, 3+ = complex
 * @param {Array}  opts.materials       - any parts customer pre-selected
 * @param {boolean} opts.waiveDiagnostic - true if diagnostic is waived (repair approved)
 */
export const computeServiceQuote = ({
  estimatedHours = SERVICE_PRICING.minHours,
  materials = [],
  waiveDiagnostic = false,
} = {}) => {
  const diagnostic = waiveDiagnostic ? 0 : SERVICE_PRICING.diagnosticFee;
  const laborHours = Math.max(SERVICE_PRICING.minHours, Number(estimatedHours) || 0);
  const laborSubtotal = round2(laborHours * SERVICE_PRICING.hourlyRate);
  const materialSubtotal = round2(
    materials.reduce((sum, m) => sum + (Number(m.price) || 0), 0),
  );

  const subtotal = round2(diagnostic + laborSubtotal + materialSubtotal);
  const gst = round2(subtotal * GST_RATE);
  const total = round2(subtotal + gst);

  return {
    quoteType: 'repair',
    diagnostic,
    labor: { hours: laborHours, rate: SERVICE_PRICING.hourlyRate, subtotal: laborSubtotal },
    materials,
    materialSubtotal,
    subtotal,
    gstRate: GST_RATE,
    gst,
    total,
  };
};

/**
 * Compute a maintenance plan annual price (GST inclusive breakdown).
 */
export const computeMaintenanceQuote = ({ planId }) => {
  const plan = getMaintenancePlan(planId);
  const subtotal = plan ? plan.price : 0;
  const gst = round2(subtotal * GST_RATE);
  const total = round2(subtotal + gst);
  return {
    quoteType: 'maintenance',
    plan,
    subtotal,
    gstRate: GST_RATE,
    gst,
    total,
  };
};

/**
 * Dispatch helper — given a wizard state, returns the relevant quote shape.
 */
export const computeQuote = (state) => {
  switch (state.quoteType) {
    case 'repair':
      return computeServiceQuote({
        estimatedHours: state.estimatedHours,
        materials: state.materials,
      });
    case 'maintenance':
      return computeMaintenanceQuote({ planId: state.maintenancePlanId });
    case 'ac-install':
    case 'furnace-install':
      return computeInstallQuote({
        quoteType: state.quoteType,
        homeSizeId: state.homeSizeId,
        tierId: state.tierId,
        materials: state.materials,
      });
    default:
      return null;
  }
};
