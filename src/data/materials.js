/**
 * Materials catalog.
 *
 * Modeled after the internal Method HVAC worker app so the same catalog can
 * power both the customer quote builder and the field worker app. Each item
 * carries a `category` (so we can filter by job type), a base `price`, and
 * an `includedIn` set that lists which package tiers automatically include it.
 *
 * Prices are MSRP-style numbers in CAD before GST. They're realistic Alberta
 * mid-2026 numbers, not lorem ipsum.
 */

export const MATERIAL_CATEGORIES = {
  AC: 'ac-install',
  FURNACE: 'furnace-install',
  THERMOSTAT: 'thermostat',
  IAQ: 'indoor-air-quality',
  ACCESSORY: 'accessory',
};

export const MATERIALS = [
  /* ---------- Air conditioners ---------- */
  {
    id: 'ac-goodman-13-2t',
    category: MATERIAL_CATEGORIES.AC,
    name: 'Goodman GSXN3 — 2 ton, 13.4 SEER2',
    brand: 'Goodman',
    sku: 'GSXN340241',
    price: 2150,
    description: 'Single-stage cooling, R-32, 10-year parts warranty. Fits homes up to ~1,500 sq ft.',
    fitsHomeSize: ['under1200', '1200to1800'],
    includedIn: ['budget'],
    tags: ['cooling'],
  },
  {
    id: 'ac-goodman-13-3t',
    category: MATERIAL_CATEGORIES.AC,
    name: 'Goodman GSXN3 — 3 ton, 13.4 SEER2',
    brand: 'Goodman',
    sku: 'GSXN340361',
    price: 2390,
    description: 'Single-stage cooling for 1,500 – 2,200 sq ft Alberta homes. Reliable and quiet.',
    fitsHomeSize: ['1200to1800', '1800to2400'],
    includedIn: ['budget'],
    tags: ['cooling'],
  },
  {
    id: 'ac-carrier-16-3t',
    category: MATERIAL_CATEGORIES.AC,
    name: 'Carrier Performance 16 — 3 ton, 16 SEER2',
    brand: 'Carrier',
    sku: '24ACC636A003',
    price: 3490,
    description: 'Two-stage compressor, much quieter (72 dBA) and lower humidity in the summer.',
    fitsHomeSize: ['1200to1800', '1800to2400'],
    includedIn: ['standard'],
    tags: ['cooling', 'two-stage'],
  },
  {
    id: 'ac-lennox-18-3t',
    category: MATERIAL_CATEGORIES.AC,
    name: 'Lennox SL18XC1 — 3 ton, 18 SEER2',
    brand: 'Lennox',
    sku: 'SL18XC1-036',
    price: 4690,
    description: 'Top-tier two-stage system. Best efficiency on the market for Alberta climates.',
    fitsHomeSize: ['1800to2400', 'over2400'],
    includedIn: ['premium'],
    tags: ['cooling', 'premium', 'two-stage'],
  },
  {
    id: 'ac-lennox-26-4t',
    category: MATERIAL_CATEGORIES.AC,
    name: 'Lennox SL26XCV — 4 ton, 26 SEER2 variable',
    brand: 'Lennox',
    sku: 'SL26XCV-048',
    price: 6890,
    description: 'Fully variable-speed flagship. Whisper-quiet (59 dBA) and rebate-eligible.',
    fitsHomeSize: ['over2400'],
    includedIn: ['premium'],
    tags: ['cooling', 'premium', 'variable-speed'],
  },

  /* ---------- Furnaces ---------- */
  {
    id: 'furnace-goodman-96-60',
    category: MATERIAL_CATEGORIES.FURNACE,
    name: 'Goodman GR9T96 — 60k BTU, 96% AFUE',
    brand: 'Goodman',
    sku: 'GR9T960603BN',
    price: 2390,
    description: 'Single-stage 96% AFUE furnace. Solid, dependable heat for smaller homes.',
    fitsHomeSize: ['under1200', '1200to1800'],
    includedIn: ['budget'],
    tags: ['heating'],
  },
  {
    id: 'furnace-goodman-96-80',
    category: MATERIAL_CATEGORIES.FURNACE,
    name: 'Goodman GR9T96 — 80k BTU, 96% AFUE',
    brand: 'Goodman',
    sku: 'GR9T960803BN',
    price: 2590,
    description: 'Single-stage furnace right-sized for typical 1,800 – 2,400 sq ft Alberta homes.',
    fitsHomeSize: ['1200to1800', '1800to2400'],
    includedIn: ['budget'],
    tags: ['heating'],
  },
  {
    id: 'furnace-carrier-97-80-2s',
    category: MATERIAL_CATEGORIES.FURNACE,
    name: 'Carrier 59TP6B — 80k BTU two-stage',
    brand: 'Carrier',
    sku: '59TP6B080V17',
    price: 3690,
    description: 'Two-stage burner with ECM blower. Quieter, more even heat, lower bills.',
    fitsHomeSize: ['1200to1800', '1800to2400'],
    includedIn: ['standard'],
    tags: ['heating', 'two-stage'],
  },
  {
    id: 'furnace-lennox-98-mod',
    category: MATERIAL_CATEGORIES.FURNACE,
    name: 'Lennox SLP99V — 80k BTU modulating',
    brand: 'Lennox',
    sku: 'SLP99V080-XV',
    price: 4990,
    description: 'Fully modulating gas valve + variable-speed blower. The quietest furnace you can buy.',
    fitsHomeSize: ['1800to2400', 'over2400'],
    includedIn: ['premium'],
    tags: ['heating', 'premium', 'modulating'],
  },
  {
    id: 'furnace-lennox-98-mod-100',
    category: MATERIAL_CATEGORIES.FURNACE,
    name: 'Lennox SLP99V — 110k BTU modulating',
    brand: 'Lennox',
    sku: 'SLP99V110-XV',
    price: 5390,
    description: 'Modulating furnace sized for large two-storey homes or walk-out basements.',
    fitsHomeSize: ['over2400'],
    includedIn: ['premium'],
    tags: ['heating', 'premium', 'modulating'],
  },

  /* ---------- Thermostats ---------- */
  {
    id: 'tstat-honeywell-pro',
    category: MATERIAL_CATEGORIES.THERMOSTAT,
    name: 'Honeywell Pro T4 programmable',
    brand: 'Honeywell',
    sku: 'TH4110U2005',
    price: 165,
    description: '7-day programmable thermostat. Reliable, easy to use, no Wi-Fi required.',
    includedIn: ['budget'],
    tags: ['controls'],
  },
  {
    id: 'tstat-ecobee-enhanced',
    category: MATERIAL_CATEGORIES.THERMOSTAT,
    name: 'ecobee Smart Enhanced',
    brand: 'ecobee',
    sku: 'EB-STATE6-01',
    price: 289,
    description: 'Wi-Fi smart thermostat with room sensor support and ENERGY STAR rebates.',
    includedIn: ['standard'],
    tags: ['controls', 'smart'],
  },
  {
    id: 'tstat-ecobee-premium',
    category: MATERIAL_CATEGORIES.THERMOSTAT,
    name: 'ecobee Premium with air quality monitor',
    brand: 'ecobee',
    sku: 'EB-STATE6P-01',
    price: 389,
    description: 'Touchscreen smart thermostat, built-in air quality monitor, smart speaker, and room sensor.',
    includedIn: ['premium'],
    tags: ['controls', 'smart', 'iaq'],
  },

  /* ---------- Indoor air quality ---------- */
  {
    id: 'iaq-aprilaire-600',
    category: MATERIAL_CATEGORIES.IAQ,
    name: 'AprilAire 600 bypass humidifier',
    brand: 'AprilAire',
    sku: 'AA600M',
    price: 545,
    description: 'Whole-home bypass humidifier. Manual control, sized for up to 4,000 sq ft.',
    includedIn: ['standard'],
    tags: ['iaq', 'humidifier'],
  },
  {
    id: 'iaq-aprilaire-800',
    category: MATERIAL_CATEGORIES.IAQ,
    name: 'AprilAire 800 steam humidifier',
    brand: 'AprilAire',
    sku: 'AA800',
    price: 1290,
    description: 'Steam humidifier — runs independent of the furnace, perfect for cold dry winters.',
    includedIn: ['premium'],
    tags: ['iaq', 'humidifier', 'premium'],
  },
  {
    id: 'iaq-media-filter',
    category: MATERIAL_CATEGORIES.IAQ,
    name: 'Honeywell F100 MERV 11 media filter cabinet',
    brand: 'Honeywell',
    sku: 'F100F2010',
    price: 290,
    description: 'Replaces the 1" filter with a 4" MERV 11 cabinet — far less restriction, better filtration.',
    includedIn: ['standard', 'premium'],
    tags: ['iaq', 'filtration'],
  },
  {
    id: 'iaq-uv-light',
    category: MATERIAL_CATEGORIES.IAQ,
    name: 'Sanuvox QUATTRO UV-C purification',
    brand: 'Sanuvox',
    sku: 'QUATTRO-RXR',
    price: 980,
    description: 'In-duct UV-C purifier — kills mold, bacteria, and viruses passing through the coil.',
    includedIn: [],
    tags: ['iaq', 'premium'],
  },
  {
    id: 'iaq-hrv-lifebreath',
    category: MATERIAL_CATEGORIES.IAQ,
    name: 'Lifebreath 170 ERVD heat recovery ventilator',
    brand: 'Lifebreath',
    sku: '170ERVD',
    price: 1690,
    description: 'Heat recovery ventilator — brings in fresh air while recovering 80% of the heat.',
    includedIn: [],
    tags: ['iaq'],
  },

  /* ---------- Accessories / install consumables ---------- */
  {
    id: 'acc-lineset-25',
    category: MATERIAL_CATEGORIES.ACCESSORY,
    name: 'New 25 ft insulated lineset (3/8 × 3/4)',
    brand: 'Mueller',
    sku: 'LS-2538',
    price: 245,
    description: 'Required when replacing an AC if the existing lineset is older than ~10 years.',
    includedIn: ['standard', 'premium'],
    tags: ['cooling', 'install'],
  },
  {
    id: 'acc-condenser-pad',
    category: MATERIAL_CATEGORIES.ACCESSORY,
    name: 'Composite condenser pad (32 × 32)',
    brand: 'DiversiTech',
    sku: 'UC3232-3',
    price: 95,
    description: 'Levelled composite pad — keeps the condenser quiet and out of the snow.',
    includedIn: ['budget', 'standard', 'premium'],
    tags: ['cooling', 'install'],
  },
  {
    id: 'acc-surge-protector',
    category: MATERIAL_CATEGORIES.ACCESSORY,
    name: 'HVAC surge protector',
    brand: 'DiversiTech',
    sku: 'SP-IIPRO',
    price: 175,
    description: 'Whole-system surge protection. Cheap insurance against summer storms.',
    includedIn: ['premium'],
    tags: ['cooling', 'heating'],
  },
  {
    id: 'acc-disconnect',
    category: MATERIAL_CATEGORIES.ACCESSORY,
    name: '60A AC disconnect + whip',
    brand: 'Siemens',
    sku: 'WN2060U',
    price: 110,
    description: 'Code-required disconnect at the condenser plus 6 ft sealtite whip.',
    includedIn: ['budget', 'standard', 'premium'],
    tags: ['cooling', 'install'],
  },
];

/* ----------- Helpers ----------- */

/** Return materials usable for a given quote service type. */
export const materialsForQuoteType = (quoteType) => {
  switch (quoteType) {
    case 'ac-install':
      return MATERIALS.filter((m) =>
        [MATERIAL_CATEGORIES.AC, MATERIAL_CATEGORIES.THERMOSTAT, MATERIAL_CATEGORIES.IAQ, MATERIAL_CATEGORIES.ACCESSORY]
          .includes(m.category),
      );
    case 'furnace-install':
      return MATERIALS.filter((m) =>
        [MATERIAL_CATEGORIES.FURNACE, MATERIAL_CATEGORIES.THERMOSTAT, MATERIAL_CATEGORIES.IAQ, MATERIAL_CATEGORIES.ACCESSORY]
          .includes(m.category),
      );
    default:
      return MATERIALS;
  }
};

/** Pick the default materials for a given quote service + tier + home size. */
export const defaultMaterialsFor = (quoteType, tier, homeSize) => {
  const pool = materialsForQuoteType(quoteType);

  const matchesTier = (m) => m.includedIn.includes(tier);
  const matchesSize = (m) => !m.fitsHomeSize || m.fitsHomeSize.includes(homeSize);

  // Only one main unit (AC or furnace) — pick the best tier-included unit that fits the home.
  const mainCategory =
    quoteType === 'ac-install' ? MATERIAL_CATEGORIES.AC : MATERIAL_CATEGORIES.FURNACE;

  const mainUnit = pool
    .filter((m) => m.category === mainCategory && matchesTier(m) && matchesSize(m))
    .sort((a, b) => a.price - b.price)[0];

  // For each non-main category, include items that ship in this tier — but
  // only when a main unit was actually selected (defensive against bad data).
  const others = mainUnit
    ? pool.filter((m) => m.category !== mainCategory && matchesTier(m))
    : [];

  return mainUnit ? [mainUnit, ...others] : others;
};

export const getMaterial = (id) => MATERIALS.find((m) => m.id === id);
