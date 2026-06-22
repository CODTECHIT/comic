import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/test", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.unosend.co/v1/emails/send",
      {
        to: [{ email: "ashokroshan78@gmail.com" }],
        subject: "Test Email from Lekhyas",
        html: "<p>This is a test email sent from the /api/v1/emails/test route.</p>",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.UNOSEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json({ message: "Test email sent successfully", data: response.data });
  } catch (error) {
    console.error("Test email failed:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to send test email", error: error.response?.data || error.message });
  }
});

export default router;
