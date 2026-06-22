import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import connectDB from "./src/config/db.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import comicRoutes from "./src/routes/comicRoutes.js";
import emailRoutes from "./src/routes/emailRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import subscriptionRoutes from "./src/routes/subscriptionRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import heroSlideRoutes from "./src/routes/heroSlideRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import testEmailRoute from "./src/routes/testEmailRoute.js";
import { notFound, errorHandler } from "./src/middleware/errorMiddleware.js";

import {
  globalLimiter,
  authLimiter,
  emailLimiter,
  commentLimiter,
  uploadLimiter,
  paymentLimiter,
} from "./src/middleware/rateLimitMiddleware.js";

import { sanitizeBody, sanitizeQuery } from "./src/middleware/sanitize.js";

dotenv.config();
connectDB();

const app = express();

// ─── Security Headers (Helmet) ────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://checkout.razorpay.com"],
      frameSrc: ["'self'", "https://api.razorpay.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://api.razorpay.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // Required for Razorpay iframe
}));

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// ─── Body Parsers with strict size limits ────────────────────────────────────
// Webhook MUST use raw body BEFORE express.json() parses it
app.use("/api/v1/orders/webhook", express.raw({ type: "application/json", limit: "100kb" }));

// All other routes: 50KB JSON limit, reject oversized bodies early
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(cookieParser());

// ─── Global Input Sanitization ───────────────────────────────────────────────
// Applied AFTER body parsing, BEFORE routes — sanitizes all inputs globally
app.use(sanitizeQuery);  // sanitize ?query=... params
app.use(sanitizeBody);   // strip XSS, block NoSQL operators from req.body

// ─── Global Rate Limit ───────────────────────────────────────────────────────
app.use(globalLimiter);

// ─── Per-route Rate Limits (applied before route handlers) ───────────────────
// Auth — strict: 5 attempts / 15 min
app.use("/api/v1/users/login",          authLimiter);
app.use("/api/v1/users/register",       authLimiter);
app.use("/api/v1/users/verify-otp",     authLimiter);
app.use("/api/v1/users/reset-password", authLimiter);
app.use("/api/v1/admin/login",          authLimiter);

// Email / OTP requests — 3 / 15 min
app.use("/api/v1/users/forgot-password", emailLimiter);
app.use("/api/v1/send-email",            emailLimiter);

// Uploads — 10 / 15 min
app.use("/api/v1/upload", uploadLimiter);

// Payments — 20 / 15 min
app.use("/api/v1/orders/create", paymentLimiter);
app.use("/api/v1/orders/verify", paymentLimiter);

// Comments — 20 posts / 15 min
app.use("/api/v1/comments", commentLimiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/v1/upload",        uploadRoutes);
app.use("/api/v1/comics",        comicRoutes);
app.use("/api/v1/send-email",    emailRoutes);
app.use("/api/v1/users",         userRoutes);
app.use("/api/v1/admin",         adminRoutes);
app.use("/api/v1/categories",    categoryRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/orders",        orderRoutes);
app.use("/api/v1/heroslides",    heroSlideRoutes);
app.use("/api/v1/comments",      commentRoutes);
app.use("/api/v1/emails",        testEmailRoute);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "unknown",
  });
});

app.get("/", (req, res) => res.send("API is running..."));

// ─── Error Handling ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, () =>
    console.log(`✅ Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`)
  );
}

export default app;
