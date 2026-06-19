/**
 * quotePayload.js
 *
 * Normalizes raw quote-builder input from the frontend into a clean,
 * predictable payload object used by the API route and the GoHighLevel
 * client. Keeps all field shaping in one place so the rest of the
 * backend can stay simple.
 *
 * Expected raw input fields (any may be missing on a given submission):
 *   customerName, phone, email, address,
 *   serviceType, homeSize,
 *   selectedPackage, selectedMaterials,
 *   laborEstimate, gstEstimate, totalEstimate, quoteRange,
 *   customerNotes
 */

const TAG_METHOD_HVAC_QUOTE = "method-hvac-quote";
const TAG_SOURCE_WEBSITE = "source-website-quote-builder";

/**
 * Trim a value to a string, or return "" if missing.
 * @param {unknown} value
 * @returns {string}
 */
function asString(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

/**
 * Convert a value to a finite number, or null if it cannot be parsed.
 * @param {unknown} value
 * @returns {number | null}
 */
function asNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * Coerce a value into an array. Single values become a one-element array.
 * Strings are split on commas. null/undefined become [].
 * @param {unknown} value
 * @returns {string[]}
 */
function asStringArray(value) {
  if (value === null || value === undefined || value === "") return [];
  if (Array.isArray(value)) {
    return value.map((v) => asString(v)).filter((v) => v.length > 0);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
  }
  return [asString(value)].filter((v) => v.length > 0);
}

/**
 * Split a full name into first/last so it can be sent to GoHighLevel,
 * which expects them as separate fields on a contact.
 * @param {string} fullName
 * @returns {{ firstName: string, lastName: string }}
 */
function splitName(fullName) {
  const name = asString(fullName);
  if (!name) return { firstName: "", lastName: "" };
  const parts = name.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

/**
 * Build the canonical quote payload from raw frontend input.
 *
 * The returned object is safe to log (no secrets) and is what the rest
 * of the backend consumes. Missing fields are normalized to "" / null
 * / [] so downstream code does not need to null-check every field.
 *
 * @param {Record<string, unknown>} input
 * @returns {object}
 */
export function buildQuotePayload(input = {}) {
  const safe = input && typeof input === "object" ? input : {};

  const customerName = asString(safe.customerName);
  const { firstName, lastName } = splitName(customerName);

  return {
    customer: {
      fullName: customerName,
      firstName,
      lastName,
      phone: asString(safe.phone),
      email: asString(safe.email).toLowerCase(),
      address: asString(safe.address),
    },
    job: {
      serviceType: asString(safe.serviceType),
      homeSize: asString(safe.homeSize),
      selectedPackage: asString(safe.selectedPackage),
      selectedMaterials: asStringArray(safe.selectedMaterials),
    },
    pricing: {
      laborEstimate: asNumber(safe.laborEstimate),
      gstEstimate: asNumber(safe.gstEstimate),
      totalEstimate: asNumber(safe.totalEstimate),
      quoteRange: asString(safe.quoteRange),
    },
    customerNotes: asString(safe.customerNotes),
    submittedAt: new Date().toISOString(),
  };
}

/**
 * Validate a built payload. Returns a list of human-readable error
 * messages; an empty array means the payload is acceptable.
 *
 * Validation is intentionally light: we require at least a way to
 * reach the customer (email or phone) and some indication of what
 * they want quoted (service type). The rest is treated as optional
 * because the quote builder may submit partial drafts.
 *
 * @param {ReturnType<typeof buildQuotePayload>} payload
 * @returns {string[]} list of validation errors, empty if valid
 */
export function validateQuotePayload(payload) {
  const errors = [];
  if (!payload || typeof payload !== "object") {
    return ["Payload is missing or not an object."];
  }
  const { customer, job } = payload;
  if (!customer || (!customer.email && !customer.phone)) {
    errors.push("Customer email or phone is required.");
  }
  if (customer && customer.email) {
    // Minimal email shape check; intentionally not a full RFC validator.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      errors.push("Customer email is not a valid email address.");
    }
  }
  if (!job || !job.serviceType) {
    errors.push("Service type is required.");
  }
  return errors;
}

/**
 * Format the quote payload as a human-readable summary suitable for
 * pasting into the GoHighLevel "Notes" field on the opportunity /
 * contact. Plain text so it renders consistently in any UI.
 *
 * @param {ReturnType<typeof buildQuotePayload>} payload
 * @returns {string}
 */
export function buildQuoteSummaryNote(payload) {
  const p = payload || {};
  const c = p.customer || {};
  const j = p.job || {};
  const pr = p.pricing || {};

  const fmtMoney = (n) =>
    typeof n === "number" && Number.isFinite(n)
      ? `$${n.toFixed(2)}`
      : "n/a";

  const materials =
    Array.isArray(j.selectedMaterials) && j.selectedMaterials.length
      ? j.selectedMaterials.join(", ")
      : "n/a";

  return [
    "Method HVAC – Website Quote Submission",
    "----------------------------------------",
    `Submitted: ${p.submittedAt || "n/a"}`,
    "",
    "Customer",
    `  Name:    ${c.fullName || "n/a"}`,
    `  Phone:   ${c.phone || "n/a"}`,
    `  Email:   ${c.email || "n/a"}`,
    `  Address: ${c.address || "n/a"}`,
    "",
    "Job",
    `  Service type: ${j.serviceType || "n/a"}`,
    `  Home size:    ${j.homeSize || "n/a"}`,
    `  Package:      ${j.selectedPackage || "n/a"}`,
    `  Materials:    ${materials}`,
    "",
    "Pricing",
    `  Labor estimate: ${fmtMoney(pr.laborEstimate)}`,
    `  GST estimate:   ${fmtMoney(pr.gstEstimate)}`,
    `  Total estimate: ${fmtMoney(pr.totalEstimate)}`,
    `  Quote range:    ${pr.quoteRange || "n/a"}`,
    "",
    "Customer notes",
    `  ${p.customerNotes || "(none)"}`,
  ].join("\n");
}

/**
 * Default set of tags applied to every quote-builder lead so the
 * Method HVAC team can filter them in GoHighLevel.
 * @returns {string[]}
 */
export function defaultQuoteTags() {
  return [TAG_METHOD_HVAC_QUOTE, TAG_SOURCE_WEBSITE];
}

export const __testables = {
  asString,
  asNumber,
  asStringArray,
  splitName,
};
