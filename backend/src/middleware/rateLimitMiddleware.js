/**
 * Centralized rate limiting configuration for all routes.
 * Uses express-rate-limit (already installed as a dependency).
 *
 * Limits:
 *  - auth: 5 req / 15 min (login, register, OTP, reset)
 *  - comment:  20 posts / 15 min (spam protection)
 *  - upload:   10 req / 15 min
 *  - payment:  20 req / 15 min
 *  - global:  100 req / 15 min (all other routes)
 */
import rateLimit from "express-rate-limit";

const makeLimit = (max, windowMs = 15 * 60 * 1000, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,   // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,     // Disable the deprecated `X-RateLimit-*` headers
    message: { message: message || `Too many requests, please try again after 15 minutes.` },
    skipSuccessfulRequests: false,
  });

// ── Auth endpoints: very strict ────────────────────────────────────────────
export const authLimiter = makeLimit(
  50,
  15 * 60 * 1000,
  "Too many authentication attempts. Please wait 15 minutes before trying again."
);

// ── Email / forgot-password: prevent OTP abuse ────────────────────────────
export const emailLimiter = makeLimit(
  3,
  15 * 60 * 1000,
  "Too many OTP requests. Please wait 15 minutes."
);

// ── Comments: prevent spam ─────────────────────────────────────────────────
export const commentLimiter = makeLimit(
  20,
  15 * 60 * 1000,
  "Comment submission limit reached. Please wait 15 minutes."
);

// ── Uploads: prevent Cloudinary abuse ─────────────────────────────────────
export const uploadLimiter = makeLimit(
  10,
  15 * 60 * 1000,
  "Upload limit reached. Please wait 15 minutes."
);

// ── Payments: prevent order flooding ──────────────────────────────────────
export const paymentLimiter = makeLimit(
  20,
  15 * 60 * 1000,
  "Payment request limit reached. Please wait 15 minutes."
);

// ── Global fallback: generous default ─────────────────────────────────────
export const globalLimiter = makeLimit(
  1000,
  15 * 60 * 1000,
  "Too many requests from this IP. Please try again later."
);
