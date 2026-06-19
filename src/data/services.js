/**
 * Service catalog — feeds the Services page, homepage overview, and quote
 * wizard's first step. Each service maps to a `quoteType` consumed by the
 * pricing engine.
 */
export const SERVICES = [
  {
    id: 'ac-install',
    quoteType: 'ac-install',
    title: 'Air Conditioner Installation',
    short: 'High-efficiency central AC, sized to your home.',
    long:
      'From 13 SEER replacements to two-stage 18 SEER systems, we install Lennox, Carrier, and Goodman ' +
      'cooling that actually fits the load of your house. Every install includes a Manual J sizing ' +
      'check, a new lineset where required, and an Alberta-compliant condensate run.',
    icon: 'snowflake',
    accent: 'brand',
    bullets: [
      'Manual J load calculation included',
      'Lineset, pad, and disconnect replaced',
      '10-year parts + 2-year Method labour warranty',
      'Refrigerant top-up and full commissioning report',
    ],
    startingAt: 3850,
    durationDays: '1 day',
  },
  {
    id: 'furnace-install',
    quoteType: 'furnace-install',
    title: 'Furnace Installation',
    short: 'Two-stage and modulating furnaces built for Alberta winters.',
    long:
      'Our furnace installs are sized for –35 °C design temperatures and finished by a ticketed ' +
      'gas fitter. Choose between 96% AFUE single-stage, two-stage, or fully modulating systems with ' +
      'ECM blowers — all paired with a smart thermostat and humidifier-ready plenum.',
    icon: 'flame',
    accent: 'heat',
    bullets: [
      'Sized for Alberta –35 °C design temperatures',
      'New venting, plenum, and condensate drain',
      '10-year parts warranty with Method labour coverage',
      'Smart thermostat included on every Standard+ package',
    ],
    startingAt: 4290,
    durationDays: '1 day',
  },
  {
    id: 'repair',
    quoteType: 'repair',
    title: 'Service & Repair',
    short: 'Same-day diagnostics. Up-front, fixed-price repairs.',
    long:
      'No surprise invoices. We diagnose your furnace, AC, or hot-water tank for a flat $89 ' +
      'fee — waived when you approve the repair. Every recommendation comes with photos and a ' +
      'fixed quote before we lift a wrench.',
    icon: 'wrench',
    accent: 'heat',
    bullets: [
      '$89 flat diagnostic, waived on repair',
      'Fully-stocked vans for first-visit fixes',
      'Photo-documented findings before any work',
      'After-hours emergency dispatch 7 days a week',
    ],
    startingAt: 89,
    durationDays: '1 – 3 hours typical',
  },
  {
    id: 'maintenance',
    quoteType: 'maintenance',
    title: 'Maintenance Plans',
    short: 'Tune-ups, priority booking, and parts discounts year-round.',
    long:
      'Our Method Care plans cover the annual tune-ups manufacturers require to keep your warranty ' +
      'valid, plus 15% off any repair parts and priority dispatch in cold snaps. Choose furnace-only, ' +
      'AC-only, or the complete home comfort plan.',
    icon: 'shield',
    accent: 'brand',
    bullets: [
      'Annual tune-up keeps your warranty valid',
      '15% off any repair parts year-round',
      'Priority dispatch during cold snaps',
      'No-charge filter delivery (Complete plan)',
    ],
    startingAt: 199,
    durationDays: 'Yearly',
  },
  {
    id: 'thermostat',
    quoteType: 'repair',
    title: 'Thermostats',
    short: 'Smart, programmable, and zoned controls.',
    long:
      'Upgrade to an ecobee Premium, Honeywell T10, or Nest Learning thermostat — installed, ' +
      'C-wire run if required, and paired with your Wi-Fi before we leave. We also design and ' +
      'commission multi-zone systems for two-storey and walk-out homes.',
    icon: 'thermostat',
    accent: 'brand',
    bullets: [
      'ecobee, Honeywell, and Nest authorized installer',
      'C-wire added where required, no extra trip',
      'Wi-Fi paired and app commissioned on-site',
      'Multi-zone design for two-storey homes',
    ],
    startingAt: 359,
    durationDays: '1 – 2 hours',
  },
  {
    id: 'iaq',
    quoteType: 'repair',
    title: 'Indoor Air Quality',
    short: 'HRVs, humidifiers, and whole-home air purification.',
    long:
      'Alberta homes are sealed tight against the cold — which means stale, dry air all winter. ' +
      'We design balanced ventilation with HRVs, add steam or bypass humidifiers, and install ' +
      'MERV 16 media filters or UV systems for allergy-sensitive households.',
    icon: 'air',
    accent: 'brand',
    bullets: [
      'Lifebreath and VanEE HRV installations',
      'Steam and bypass humidifiers',
      'MERV 13 / 16 media filter cabinets',
      'UV-C and bipolar ionization options',
    ],
    startingAt: 749,
    durationDays: '½ – 1 day',
  },
];

export const getService = (id) => SERVICES.find((s) => s.id === id);
