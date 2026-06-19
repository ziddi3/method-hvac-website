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
      try {
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
      } catch (err) {
        // Filesystem write failed (permissions, disk full, read-only fs, ...).
        // Log server-side detail but keep client response generic.
        console.error("[quote-submit] local save failed:", err && err.message);
        return {
          status: 500,
          body: {
            ok: false,
            code: "LOCAL_SAVE_FAILED",
            message:
              "CRM not configured and the local dev fallback could not save the submission.",
            missingEnv: missing,
          },
        };
      }
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
    // Log full server-side context, but never echo upstream status codes
    // or error bodies to the client: a GHL 401/403 must not turn into a
    // 401/403 from *our* endpoint (the user is not the one unauthorized),
    // and upstream messages can contain backend identifiers.
    console.error(
      "[quote-submit] CRM submission failed:",
      (err && err.status) || "?",
      (err && err.message) || err,
    );
    return {
      status: 502,
      body: {
        ok: false,
        code: "CRM_SUBMISSION_FAILED",
        message:
          "Failed to submit quote to CRM. Please try again or contact us directly.",
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

  try {
    let body = req.body;
    if (body === undefined) {
      body = await readJsonBody(req);
    }

    const { status, body: responseBody } = await handleQuoteSubmit(body);
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(responseBody));
  } catch (err) {
    // Covers: readJsonBody rejections (e.g. 413 over-size, request errors)
    // and any unexpected throw from handleQuoteSubmit. Without this,
    // the rejection would escape as an unhandled promise rejection and
    // the client connection would hang.
    const status = (err && err.status) || 500;
    console.error(
      "[quote-submit] handler error:",
      status,
      (err && err.message) || err,
    );
    if (!res.headersSent) {
      res.statusCode = status;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          ok: false,
          code: status === 413 ? "PAYLOAD_TOO_LARGE" : "INTERNAL_ERROR",
          message:
            status === 413
              ? "Quote submission is too large."
              : "Quote submission could not be processed.",
        }),
      );
    } else {
      res.end();
    }
  }
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
