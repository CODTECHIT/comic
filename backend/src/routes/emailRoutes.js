/* eslint-env node */
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

import { validateRequest, sendEmailSchema, contactFormSchema } from "../middleware/validateMiddleware.js";
import { sendContactFormEmail } from "../services/emailService.js";
import rateLimit from "express-rate-limit";

// Rate limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 3, // 3 requests
  message: { message: "Too many contact requests from this IP, please try again after 30 minutes." }
});
import { emailLimiter } from "../middleware/rateLimitMiddleware.js";

router.post("/", emailLimiter, validateRequest(sendEmailSchema), async (req, req_res) => {
  const { to, subject, html } = req.body;

  try {
    const response = await axios.post(
      "https://api.unosend.co/v1/emails/send",
      {
        to: [{ email: to }],
        subject: subject,
        html: html,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.UNOSEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    req_res.json({ message: "Email sent successfully", data: response.data });
  } catch (error) {
    console.error("Unosend API error:", error.response?.data || error.message);
    req_res.status(500).json({ message: "Failed to send email", error: error.response?.data || error.message });
  }
});

import Contact from "../models/Contact.js";

router.post("/contact", contactLimiter, validateRequest(contactFormSchema), async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    const contact = new Contact({ name, email, phone, message });
    await contact.save();

    sendContactFormEmail(name, email, phone, message);
    res.json({ message: "Contact form submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to process contact form", error: error.message });
  }
});

export default router;
