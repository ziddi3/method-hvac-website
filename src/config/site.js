/**
 * Site-wide configuration.
 * Centralized so future Method ecosystem integrations (Hub URL, GHL endpoint,
 * support phone) can be swapped in one place.
 */
export const SITE = {
  name: 'Method HVAC',
  tagline: "It's all in the Method.",
  phone: '(587) 555-0144',
  phoneHref: 'tel:+15875550144',
  emergencyPhone: '(587) 555-0199',
  emergencyHref: 'tel:+15875550199',
  email: 'hello@methodhvac.ca',
  emailHref: 'mailto:hello@methodhvac.ca',
  address: {
    street: '4820 - 23 Street SE',
    city: 'Calgary',
    region: 'AB',
    postal: 'T2B 1A2',
    country: 'Canada',
  },
  hours: [
    { day: 'Mon – Fri', hours: '7:00 AM – 8:00 PM' },
    { day: 'Saturday',  hours: '8:00 AM – 5:00 PM' },
    { day: 'Sunday',    hours: 'Emergency service only' },
  ],
  serviceArea: [
    'Calgary',
    'Airdrie',
    'Cochrane',
    'Okotoks',
    'Chestermere',
    'Strathmore',
    'High River',
    'Red Deer',
    'Edmonton',
    'Sherwood Park',
    'Spruce Grove',
    'Leduc',
  ],
  licenses: [
    { label: 'Alberta Master Gas Fitter', number: 'AB-MGF-104882' },
    { label: 'WCB Alberta Account', number: '8421-7740' },
    { label: 'HRAI Certified Contractor', number: 'HRAI-21884' },
  ],
  social: {
    facebook: 'https://facebook.com/methodhvac',
    instagram: 'https://instagram.com/methodhvac',
    google: 'https://g.page/methodhvac',
  },
  /**
   * Method Hub — the parent ecosystem this site composes into.
   * Update this URL once the hub is live; every "Return to Method Hub"
   * link reads from here.
   */
  hubUrl: 'https://hub.methodbuilt.ca',
  hubLabel: 'Return to Method Hub',
};

/** Alberta GST rate, applied transparently on every quote. */
export const GST_RATE = 0.05;

/** Years in business — derived from founding year so it stays current. */
export const FOUNDED_YEAR = 2014;
export const yearsInBusiness = () => new Date().getFullYear() - FOUNDED_YEAR;
