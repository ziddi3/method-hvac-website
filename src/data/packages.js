/**
 * Package tiers used by the quote builder.
 *
 * Each tier carries:
 *  - laborMultiplier: how labor scales vs. a base "budget" install
 *  - workmanshipYears: warranty length included
 *  - perks: customer-visible perks shown in the picker + summary
 */
export const PACKAGE_TIERS = [
  {
    id: 'budget',
    name: 'Budget',
    headline: 'Reliable comfort, fairly priced.',
    summary:
      'A solid Goodman system installed to manufacturer spec — no upsells, no fluff. Ideal ' +
      'when you need a working system before next winter and want the lowest sensible price.',
    laborMultiplier: 1.0,
    workmanshipYears: 1,
    perks: [
      'Goodman 13 SEER2 / 96% AFUE equipment',
      'Programmable Honeywell thermostat',
      '1-year Method workmanship warranty',
      '10-year manufacturer parts warranty',
    ],
    badge: 'Best entry price',
  },
  {
    id: 'standard',
    name: 'Standard',
    headline: 'Two-stage comfort with smart controls.',
    summary:
      'Our most popular tier. Carrier two-stage equipment, ecobee smart thermostat, bypass ' +
      'humidifier, and a 4" media filter cabinet. Quieter, more even, and meaningfully more ' +
      'efficient than the budget tier.',
    laborMultiplier: 1.15,
    workmanshipYears: 2,
    perks: [
      'Carrier two-stage equipment + ECM blower',
      'ecobee Smart Enhanced thermostat',
      'AprilAire 600 bypass humidifier',
      '4" MERV 11 media filter cabinet',
      '2-year Method workmanship warranty',
    ],
    badge: 'Most popular',
  },
  {
    id: 'premium',
    name: 'Premium',
    headline: 'The quietest, most efficient system you can buy.',
    summary:
      'Lennox flagship equipment — variable-speed cooling, modulating heat, ecobee Premium with ' +
      'built-in air quality monitoring, steam humidification, and surge protection. Built to last ' +
      'and barely heard.',
    laborMultiplier: 1.35,
    workmanshipYears: 5,
    perks: [
      'Lennox variable-speed AC + modulating furnace',
      'ecobee Premium with air quality monitor',
      'AprilAire 800 steam humidifier',
      'Whole-system surge protector',
      '5-year Method workmanship warranty',
      'Free first annual tune-up',
    ],
    badge: 'White-glove install',
  },
];

export const getTier = (id) => PACKAGE_TIERS.find((t) => t.id === id);
