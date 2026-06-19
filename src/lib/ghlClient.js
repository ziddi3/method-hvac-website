/**
 * ghlClient.js
 *
 * Thin wrapper around the GoHighLevel REST API used by the quote
 * submission flow. Reads configuration exclusively from environment
 * variables — no secrets are ever hardcoded.
 *
 * Required environment variables (all must be set for live mode):
 *   GHL_API_KEY        Personal Access Token / API key
 *   GHL_LOCATION_ID    Sub-account (location) the quote belongs to
 *   GHL_PIPELINE_ID    Pipeline ID for new opportunities
 *   GHL_STAGE_ID       Initial stage ID within that pipeline
 *   GHL_API_BASE_URL   Base URL, e.g. https://services.leadconnectorhq.com
 *
 * If any are missing, `isConfigured()` returns false and the API route
 * is expected to fall back to local-only handling. The client itself
 * will refuse to make live calls in that state.
 *
 * The methods below are intentionally framework-free (no Express /
 * Next types) so they can be reused from any backend host.
 */

const REQUIRED_ENV_VARS = [
  "GHL_API_KEY",
  "GHL_LOCATION_ID",
  "GHL_PIPELINE_ID",
  "GHL_STAGE_ID",
  "GHL_API_BASE_URL",
];

/**
 * Read GHL configuration from process.env. Returns the resolved config
 * and a list of any missing variable names so callers can produce a
 * clear error message without leaking values.
 *
 * @returns {{
 *   config: {
 *     apiKey: string,
 *     locationId: string,
 *     pipelineId: string,
 *     stageId: string,
 *     baseUrl: string,
 *   },
 *   missing: string[],
 * }}
 */
export function getGhlConfig() {
  const env = (typeof process !== "undefined" && process.env) || {};
  const config = {
    apiKey: env.GHL_API_KEY || "",
    locationId: env.GHL_LOCATION_ID || "",
    pipelineId: env.GHL_PIPELINE_ID || "",
    stageId: env.GHL_STAGE_ID || "",
    baseUrl: (env.GHL_API_BASE_URL || "").replace(/\/+$/, ""),
  };
  const missing = REQUIRED_ENV_VARS.filter((name) => !env[name]);
  return { config, missing };
}

/**
 * @returns {boolean} true iff every required env var is present.
 */
export function isConfigured() {
  return getGhlConfig().missing.length === 0;
}

/**
 * Build the headers GoHighLevel expects on every authenticated call.
 * Kept private — callers go through the higher-level helpers below.
 *
 * @param {{ apiKey: string }} config
 * @returns {Record<string, string>}
 */
function buildHeaders(config) {
  return {
    Authorization: `Bearer ${config.apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    // GoHighLevel v2 API requires an explicit version header.
    Version: "2021-07-28",
  };
}

/**
 * Internal fetch helper that throws on non-2xx responses with a
 * trimmed, log-safe error (no auth headers, no request body echo).
 *
 * @param {string} url
 * @param {RequestInit} init
 * @returns {Promise<any>}
 */
async function ghlFetch(url, init) {
  if (typeof fetch !== "function") {
    throw new Error(
      "Global fetch is not available. Node 18+ is required to use ghlClient.",
    );
  }
  const res = await fetch(url, init);
  const text = await res.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  if (!res.ok) {
    const message =
      (body && typeof body === "object" && (body.message || body.error)) ||
      `GoHighLevel request failed with status ${res.status}`;
    const err = new Error(message);
    // Attach minimal context for the API layer to log.
    err.status = res.status;
    err.endpoint = url;
    throw err;
  }
  return body;
}

/**
 * Create a new contact in GoHighLevel, or update the existing one if
 * a contact with the same email/phone already exists in the location.
 *
 * Implementation note: GoHighLevel exposes an "upsert" endpoint that
 * does exactly this and returns the resulting contact. We use it so
 * we don't need to query first.
 *
 * @param {ReturnType<import("./quotePayload.js").buildQuotePayload>} payload
 * @returns {Promise<{ id: string, raw: any }>}
 */
export async function upsertContact(payload) {
  const { config, missing } = getGhlConfig();
  if (missing.length) {
    throw new Error(
      `GoHighLevel client is not configured (missing: ${missing.join(", ")}).`,
    );
  }

  const customer = (payload && payload.customer) || {};
  const body = {
    locationId: config.locationId,
    firstName: customer.firstName || undefined,
    lastName: customer.lastName || undefined,
    name: customer.fullName || undefined,
    email: customer.email || undefined,
    phone: customer.phone || undefined,
    address1: customer.address || undefined,
    source: "Method HVAC – Website Quote Builder",
  };

  const result = await ghlFetch(`${config.baseUrl}/contacts/upsert`, {
    method: "POST",
    headers: buildHeaders(config),
    body: JSON.stringify(body),
  });

  // GHL responses nest the contact differently across versions; tolerate both.
  const contact = (result && (result.contact || result.data)) || result || {};
  const id = contact.id || contact.contactId || "";
  if (!id) {
    throw new Error("GoHighLevel did not return a contact id after upsert.");
  }
  return { id, raw: result };
}

/**
 * Create a new opportunity for the contact in the configured pipeline
 * and stage.
 *
 * @param {string} contactId
 * @param {ReturnType<import("./quotePayload.js").buildQuotePayload>} payload
 * @returns {Promise<{ id: string, raw: any }>}
 */
export async function createOpportunity(contactId, payload) {
  const { config, missing } = getGhlConfig();
  if (missing.length) {
    throw new Error(
      `GoHighLevel client is not configured (missing: ${missing.join(", ")}).`,
    );
  }
  if (!contactId) {
    throw new Error("createOpportunity requires a contactId.");
  }

  const pricing = (payload && payload.pricing) || {};
  const job = (payload && payload.job) || {};
  const customer = (payload && payload.customer) || {};

  const name =
    `${customer.fullName || "New lead"} – ${job.serviceType || "Quote"}`.trim();

  const body = {
    pipelineId: config.pipelineId,
    pipelineStageId: config.stageId,
    locationId: config.locationId,
    name,
    status: "open",
    contactId,
    monetaryValue:
      typeof pricing.totalEstimate === "number" ? pricing.totalEstimate : undefined,
  };

  const result = await ghlFetch(`${config.baseUrl}/opportunities/`, {
    method: "POST",
    headers: buildHeaders(config),
    body: JSON.stringify(body),
  });

  const opp = (result && (result.opportunity || result.data)) || result || {};
  const id = opp.id || opp.opportunityId || "";
  if (!id) {
    throw new Error("GoHighLevel did not return an opportunity id.");
  }
  return { id, raw: result };
}

/**
 * Apply (add) the given tags to a contact. GoHighLevel's tag endpoint
 * is additive — existing tags are preserved.
 *
 * @param {string} contactId
 * @param {string[]} tags
 * @returns {Promise<any>}
 */
export async function applyTagsToContact(contactId, tags) {
  const { config, missing } = getGhlConfig();
  if (missing.length) {
    throw new Error(
      `GoHighLevel client is not configured (missing: ${missing.join(", ")}).`,
    );
  }
  if (!contactId) {
    throw new Error("applyTagsToContact requires a contactId.");
  }
  const cleanTags = Array.isArray(tags)
    ? tags.map((t) => String(t).trim()).filter((t) => t.length > 0)
    : [];
  if (cleanTags.length === 0) return { skipped: true };

  return ghlFetch(`${config.baseUrl}/contacts/${contactId}/tags`, {
    method: "POST",
    headers: buildHeaders(config),
    body: JSON.stringify({ tags: cleanTags }),
  });
}

/**
 * Attach a free-form text note to a contact. Used for the quote
 * summary so the sales team has the full breakdown next to the lead.
 *
 * @param {string} contactId
 * @param {string} noteBody
 * @returns {Promise<any>}
 */
export async function addNoteToContact(contactId, noteBody) {
  const { config, missing } = getGhlConfig();
  if (missing.length) {
    throw new Error(
      `GoHighLevel client is not configured (missing: ${missing.join(", ")}).`,
    );
  }
  if (!contactId) {
    throw new Error("addNoteToContact requires a contactId.");
  }
  const body = asString(noteBody);
  if (!body) return { skipped: true };

  return ghlFetch(`${config.baseUrl}/contacts/${contactId}/notes`, {
    method: "POST",
    headers: buildHeaders(config),
    body: JSON.stringify({ body }),
  });
}

/**
 * High-level helper that runs the full quote-submission flow against
 * GoHighLevel: upsert contact → create opportunity → apply tags →
 * attach summary note. Each step's result is returned so the API
 * route can surface ids in the response or in logs.
 *
 * Any failure short-circuits and is thrown to the caller.
 *
 * @param {ReturnType<import("./quotePayload.js").buildQuotePayload>} payload
 * @param {{ tags?: string[], summaryNote?: string }} options
 * @returns {Promise<{
 *   contactId: string,
 *   opportunityId: string,
 *   tagsResult: any,
 *   noteResult: any,
 * }>}
 */
export async function submitQuoteToGhl(payload, options = {}) {
  const { id: contactId, raw: contactRaw } = await upsertContact(payload);
  const { id: opportunityId } = await createOpportunity(contactId, payload);

  let tagsResult = null;
  if (options.tags && options.tags.length) {
    tagsResult = await applyTagsToContact(contactId, options.tags);
  }

  let noteResult = null;
  if (options.summaryNote) {
    noteResult = await addNoteToContact(contactId, options.summaryNote);
  }

  return {
    contactId,
    opportunityId,
    tagsResult,
    noteResult,
    // contactRaw is intentionally returned for debug/logging only;
    // the API route should NOT echo it back to the browser.
    _debug: { contactRaw },
  };
}

/**
 * Tiny local string helper to avoid pulling quotePayload into ghlClient
 * just for trimming; the client must stay self-contained.
 * @param {unknown} v
 * @returns {string}
 */
function asString(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}
