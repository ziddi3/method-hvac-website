/**
 * quote-submit.js
 *
 * POST /api/quote-submit
 *
 * Accepts a JSON body from the frontend quote builder, normalizes it
 * via quotePayload, and submits it to GoHighLevel via ghlClient.
 *
 * Behavior when CRM is not configured:
 *   - In development (NODE_ENV !== "production"), the submission is
 *     written to ./.local-quotes/<timestamp>.json and a 202 response
 *     is returned describing the local fallback.
 *   - Otherwise, a 503 response is returned with `code: "CRM_NOT_CONFIGURED"`.
 *
 * The handler is framework-agnostic: it exports both a Node-style
 * (req, res) handler and a generic `handleQuoteSubmit(body)` function
 * so the same logic can be wired into Express, Next.js API routes,
 * Vercel/Netlify functions, or any other host.
 */

import fs from "node:fs/promises";
import path from "node:path";

import {
  buildQuotePayload,
  validateQuotePayload,
  buildQuoteSummaryNote,
  defaultQuoteTags,
} from "../lib/quotePayload.js";
import {
  isConfigured,
  getGhlConfig,
  submitQuoteToGhl,
} from "../lib/ghlClient.js";

const LOCAL_QUOTES_DIR = ".local-quotes";

/**
 * Pure, framework-free entry point. Takes the raw request body (already
 * parsed JSON) and returns a `{ status, body }` pair the host can use
 * to write an HTTP response.
 *
 * @param {unknown} rawBody
 * @returns {Promise<{ status: number, body: object }>}
 */
export async function handleQuoteSubmit(rawBody) {
  // Defensive parse: accept either a parsed object or a JSON string.
  let parsed = rawBody;
  if (typeof rawBody === "string") {
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      return {
        status: 400,
        body: {
          ok: false,
          code: "INVALID_JSON",
          message: "Request body must be valid JSON.",
        },
      };
    }
  }

  const payload = buildQuotePayload(parsed || {});
  const errors = validateQuotePayload(payload);
  if (errors.length) {
    return {
      status: 400,
      body: {
        ok: false,
        code: "VALIDATION_FAILED",
        message: "Quote submission is missing required fields.",
        errors,
      },
    };
  }

  const summaryNote = buildQuoteSummaryNote(payload);
  const tags = defaultQuoteTags();

  // --- CRM not configured: fall back to local-only handling. ---------
  if (!isConfigured()) {
    const { missing } = getGhlConfig();
    const isDev =
      (typeof process !== "undefined" &&
        process.env &&
        process.env.NODE_ENV !== "production") ||
      typeof process === "undefined";

    if (isDev) {
      const saved = await saveQuoteLocally({ payload, summaryNote, tags });
      return {
        status: 202,
        body: {
          ok: true,
          code: "CRM_NOT_CONFIGURED_DEV_FALLBACK",
          message:
            "CRM not configured. Quote saved locally for development review.",
          missingEnv: missing,
          savedTo: saved.relativePath,
        },
      };
    }

    return {
      status: 503,
      body: {
        ok: false,
        code: "CRM_NOT_CONFIGURED",
        message:
          "CRM not configured. Set GHL_* environment variables to enable quote submissions.",
        missingEnv: missing,
      },
    };
  }

  // --- Live submission to GoHighLevel. -------------------------------
  try {
    const result = await submitQuoteToGhl(payload, { tags, summaryNote });
    return {
      status: 201,
      body: {
        ok: true,
        code: "SUBMITTED",
        message: "Quote submitted to CRM.",
        contactId: result.contactId,
        opportunityId: result.opportunityId,
      },
    };
  } catch (err) {
    // Don't leak request bodies, auth headers, or stack traces to the client.
    const status = (err && err.status) || 502;
    return {
      status,
      body: {
        ok: false,
        code: "CRM_SUBMISSION_FAILED",
        message:
          (err && err.message) ||
          "Failed to submit quote to CRM. Please try again.",
      },
    };
  }
}

/**
 * Persist a quote locally (development fallback). Files are written
 * to `<cwd>/.local-quotes/<ISO-timestamp>-<random>.json` so the
 * Method HVAC team can still review submissions while the CRM
 * integration is being set up.
 *
 * Returns the absolute and repo-relative paths of the saved file.
 *
 * @param {{ payload: object, summaryNote: string, tags: string[] }} args
 * @returns {Promise<{ absolutePath: string, relativePath: string }>}
 */
export async function saveQuoteLocally({ payload, summaryNote, tags }) {
  const dir = path.join(process.cwd(), LOCAL_QUOTES_DIR);
  await fs.mkdir(dir, { recursive: true });

  const safeTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const rand = Math.random().toString(36).slice(2, 8);
  const filename = `${safeTimestamp}-${rand}.json`;
  const absolutePath = path.join(dir, filename);

  const fileBody = {
    savedAt: new Date().toISOString(),
    note: "Saved locally because CRM env vars were missing. Do not commit.",
    payload,
    summaryNote,
    tags,
  };

  await fs.writeFile(absolutePath, JSON.stringify(fileBody, null, 2), "utf8");

  return {
    absolutePath,
    relativePath: path.join(LOCAL_QUOTES_DIR, filename),
  };
}

/**
 * Node-style HTTP handler: usable directly from Express, Next.js
 * pages/api, or a bare `http.createServer` setup. Reads JSON from the
 * request, delegates to `handleQuoteSubmit`, and writes the response.
 *
 * @param {import("http").IncomingMessage & { body?: unknown }} req
 * @param {import("http").ServerResponse} res
 */
export default async function quoteSubmitHandler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        ok: false,
        code: "METHOD_NOT_ALLOWED",
        message: "POST required.",
      }),
    );
    return;
  }

  let body = req.body;
  if (body === undefined) {
    body = await readJsonBody(req);
  }

  const { status, body: responseBody } = await handleQuoteSubmit(body);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(responseBody));
}

/**
 * Read and JSON-parse an incoming request body. Used when the host
 * framework has not already populated `req.body`. Caps payload size to
 * 1 MB to avoid trivial DoS via huge bodies.
 *
 * @param {import("http").IncomingMessage} req
 * @returns {Promise<unknown>}
 */
async function readJsonBody(req) {
  const MAX_BYTES = 1_000_000;
  return new Promise((resolve, reject) => {
    let received = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      received += chunk.length;
      if (received > MAX_BYTES) {
        reject(Object.assign(new Error("Payload too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        // Defer to handleQuoteSubmit's INVALID_JSON path.
        resolve(raw);
      }
    });
    req.on("error", reject);
  });
}
