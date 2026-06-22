import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * Core function to send an email via Unosend.
 * Handles its own errors so calling functions do not crash.
 */
const sendHtmlEmail = async (to, subject, html, emailType) => {
  try {
    if (!process.env.UNOSEND_API_KEY) {
      console.warn(`[Email Service] Skipped ${emailType}: UNOSEND_API_KEY not configured`);
      return;
    }

    const payload = {
      to: [{ email: to }],
      subject: subject,
      html: html,
    };

    if (process.env.EMAIL_FROM) {
      payload.from = { email: process.env.EMAIL_FROM, name: "Lekhyas" };
    }

    await axios.post(
      "https://api.unosend.co/v1/emails/send",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.UNOSEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`[Email Service] Successfully sent ${emailType} to ${to} at ${new Date().toISOString()}`);
  } catch (error) {
    console.error(`[Email Service] Failed to send ${emailType} to ${to} at ${new Date().toISOString()}:`, error.response?.data || error.message);
    // Error is intentionally swallowed so that execution of the main flow continues
  }
};

export const sendWelcomeEmail = async (email, username, websiteName) => {
  const subject = `Welcome to ${websiteName}, ${username}!`;
  const html = `
    <div style="font-family: sans-serif; color: #333;">
      <h2>Welcome to ${websiteName}!</h2>
      <p>Hi ${username},</p>
      <p>We are thrilled to have you join our community. Dive into the world of Indian mythology and action comics!</p>
      <p>Get ready for an epic journey.</p>
      <br>
      <p>Regards,<br>The Lekhyas Team</p>
    </div>
  `;
  await sendHtmlEmail(email, subject, html, "Welcome Email");
};

export const sendPasswordResetOTP = async (email, otp) => {
  const subject = "Your Password Reset OTP";
  const html = `
    <div style="font-family: sans-serif; color: #333;">
      <h2>Password Reset Request</h2>
      <p>We received a request to reset the password for your account.</p>
      <p>Your OTP is: <strong style="font-size: 24px; color: #C8181E;">${otp}</strong></p>
      <p>It is valid for 5 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;
  await sendHtmlEmail(email, subject, html, "Password Reset OTP");
};

export const sendBookPurchaseEmail = async (email, title, amount, orderId) => {
  const subject = `Order Confirmation: ${title}`;
  const html = `
    <div style="font-family: sans-serif; color: #333;">
      <h2>Thank You for Your Purchase!</h2>
      <p>Your order for <strong>${title}</strong> has been successfully processed.</p>
      <ul>
        <li><strong>Order ID:</strong> ${orderId}</li>
        <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
        <li><strong>Amount Paid:</strong> ₹${(amount / 100).toFixed(2)}</li>
      </ul>
      <p>You can now read this comic in your dashboard.</p>
      <br>
      <p>Regards,<br>The Lekhyas Team</p>
    </div>
  `;
  await sendHtmlEmail(email, subject, html, "Book Purchase Confirmation");
};

export const sendMembershipPurchaseEmail = async (email, planName, startDate, expiryDate, amount, orderId) => {
  const subject = `Membership Confirmation: ${planName} Plan`;
  const html = `
    <div style="font-family: sans-serif; color: #333;">
      <h2>Welcome to the ${planName} Plan!</h2>
      <p>Your membership has been successfully activated.</p>
      <ul>
        <li><strong>Order ID:</strong> ${orderId}</li>
        <li><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString()}</li>
        <li><strong>Expiry Date:</strong> ${new Date(expiryDate).toLocaleDateString()}</li>
        <li><strong>Amount Paid:</strong> ₹${(amount / 100).toFixed(2)}</li>
      </ul>
      <p>Enjoy unlimited access to our premium content during your subscription period.</p>
      <br>
      <p>Regards,<br>The Lekhyas Team</p>
    </div>
  `;
  await sendHtmlEmail(email, subject, html, "Membership Purchase Confirmation");
};

export const sendContactFormEmail = async (name, userEmail, subject, message) => {
  const adminEmail = process.env.ADMIN_CONTACT_EMAIL;
  if (!adminEmail) {
    console.error("[Email Service] ADMIN_CONTACT_EMAIL is not configured.");
    // We still proceed to try sending the acknowledgment below
  } else {
    // Send to Admin
    const adminHtml = `
      <div style="font-family: sans-serif; color: #333;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `;
    await sendHtmlEmail(adminEmail, `New Contact Inquiry: ${subject}`, adminHtml, "Contact Form (To Admin)");
  }

  // Send Acknowledgment to User
  const ackHtml = `
    <div style="font-family: sans-serif; color: #333;">
      <p>Hello ${name},</p>
      <br>
      <p>Thank you for contacting Lekhyas.</p>
      <p>We have successfully received your message and our team will get back to you shortly.</p>
      <br>
      <p>This is an automated email. Please do not reply.</p>
      <br>
      <p>Regards,</p>
      <p>Lekhyas Team</p>
    </div>
  `;
  await sendHtmlEmail(userEmail, "We received your message", ackHtml, "Contact Form Acknowledgment");
};
