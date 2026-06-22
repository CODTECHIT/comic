/**
 * Input sanitization and payload validation middleware.
 *
 * Defends against:
 *  - XSS via HTML injection in strings
 *  - Oversized JSON payloads (default: 100KB, media: configurable)
 *  - NoSQL injection via $-prefixed MongoDB operators
 *  - Prototype pollution
 *  - Malformed/non-JSON bodies on JSON routes
 */

// ── HTML / XSS Sanitization ─────────────────────────────────────────────────
const UNSAFE_HTML = /<[^>]*>/g;

function stripHtml(value) {
  if (typeof value === "string") {
    return value.replace(UNSAFE_HTML, "").trim();
  }
  return value;
}

// ── NoSQL injection: block keys containing $ or . ───────────────────────────
function hasDangerousKeys(obj, depth = 0) {
  if (depth > 10 || typeof obj !== "object" || obj === null) return false;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) return true;
    if (typeof obj[key] === "object" && hasDangerousKeys(obj[key], depth + 1)) return true;
  }
  return false;
}

// ── Deep sanitize all string values in an object ────────────────────────────
function deepSanitize(obj, depth = 0) {
  if (depth > 10) return obj;
  if (typeof obj === "string") return stripHtml(obj);
  if (Array.isArray(obj)) return obj.map((v) => deepSanitize(v, depth + 1));
  if (typeof obj === "object" && obj !== null) {
    const clean = Object.create(null);
    for (const [key, val] of Object.entries(obj)) {
      // skip __proto__, constructor, prototype — prototype pollution guard
      if (["__proto__", "constructor", "prototype"].includes(key)) continue;
      clean[key] = deepSanitize(val, depth + 1);
    }
    return clean;
  }
  return obj;
}

/**
 * sanitizeBody — strips HTML, rejects NoSQL operators, cleans all string fields.
 * Apply to every route that accepts req.body.
 */
export const sanitizeBody = (req, res, next) => {
  if (!req.body || typeof req.body !== "object") return next();

  // Block NoSQL injection attempts
  if (hasDangerousKeys(req.body)) {
    return res.status(400).json({ message: "Invalid characters detected in request body." });
  }

  req.body = deepSanitize(req.body);
  next();
};

/**
 * sanitizeQuery — sanitize query params (e.g., ?status=...)
 */
export const sanitizeQuery = (req, res, next) => {
  if (req.query && typeof req.query === "object") {
    if (hasDangerousKeys(req.query)) {
      return res.status(400).json({ message: "Invalid characters detected in query parameters." });
    }
    req.query = deepSanitize(req.query);
  }
  next();
};

/**
 * rejectOversizedPayload — middleware to reject payloads above a given byte size.
 * Express's built-in `express.json({ limit })` handles the raw limit, but this
 * provides a clear error message and an extra guard on already-parsed bodies.
 *
 * @param {number} maxBytes - maximum allowed body size in bytes
 */
export const rejectOversizedPayload = (maxBytes = 100 * 1024) => (req, res, next) => {
  const contentLength = parseInt(req.headers["content-length"] || "0", 10);
  if (contentLength > maxBytes) {
    return res.status(413).json({
      message: `Payload too large. Maximum allowed size is ${Math.round(maxBytes / 1024)}KB.`,
    });
  }
  next();
};

/**
 * validateContentType — reject non-JSON bodies on JSON-only endpoints.
 * Prevents certain bypass techniques that rely on form-encoding.
 */
export const requireJson = (req, res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    const ct = req.headers["content-type"] || "";
    if (!ct.includes("application/json") && !ct.includes("multipart/form-data")) {
      return res.status(415).json({ message: "Unsupported Media Type. Use application/json." });
    }
  }
  next();
};
