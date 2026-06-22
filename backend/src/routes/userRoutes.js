import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { validateRequest, registerSchema, loginSchema, forgotPasswordSchema, otpSchema, resetPasswordSchema } from "../middleware/validateMiddleware.js";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { sendWelcomeEmail, sendPasswordResetOTP } from "../services/emailService.js";

const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token; // also return for Bearer header use
};

const router = express.Router();

// Rate limiter for forgot password
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests
  message: { message: "Too many password reset requests from this IP, please try again after 15 minutes." }
});

// POST /api/v1/users/register
router.post("/register", validateRequest(registerSchema), async (req, res) => {
  try {
    const { username, email, mobile, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });
    
    const user = new User({ username, email, mobile, password });
    await user.save();
    
    // Send welcome email asynchronously
    sendWelcomeEmail(user.email, user.username, "Lekhyas");
    
    const token = generateToken(res, user._id);
    res.status(201).json({ message: "Registered successfully", user: { _id: user._id, email: user.email, username: user.username, token } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/v1/users/login
router.post("/login", validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(res, user._id);
      res.json({ message: "Logged in", user: { _id: user._id, email: user.email, username: user.username, token } });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/users/profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("purchasedComics")
      .populate("readingHistory")
      .select("-password");
      
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/users/access/:comicId
// Check if user has access to read a specific comic
router.get("/access/:comicId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const comicId = req.params.comicId;
    let hasAccess = false;
    let reason = "No access";

    // 1. Check if user has active membership
    if (user.subscriptionExpiry && new Date(user.subscriptionExpiry) > new Date()) {
      hasAccess = true;
      reason = "Active membership";
    } 
    // 2. Else check if user purchased this specific comic
    else if (user.purchasedComics && user.purchasedComics.some(id => id.toString() === comicId)) {
      hasAccess = true;
      reason = "Purchased comic";
    }

    res.json({ hasAccess, reason });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/users/forgot-password (request OTP)
router.post("/forgot-password", forgotPasswordLimiter, validateRequest(forgotPasswordSchema), async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Delete existing OTPs for email
    await OTP.deleteMany({ email });
    
    // Save new OTP
    await new OTP({ email, otp }).save();

    // Send email asynchronously
    sendPasswordResetOTP(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/users/verify-otp
router.post("/verify-otp", validateRequest(otpSchema), async (req, res) => {
  try {
    const { email, otp } = req.body;
    const validOtp = await OTP.findOne({ email, otp });
    
    if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP" });
    
    // Delete used OTP
    await OTP.deleteMany({ email });
    
    res.json({ message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/users/reset-password
// Requires OTP to have been verified first (via /verify-otp), then re-checks it here
router.post("/reset-password", validateRequest(resetPasswordSchema), async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    // Re-verify the OTP is still valid — prevents unauthenticated resets
    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP. Please restart the forgot-password flow." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    
    user.password = newPassword;
    await user.save();

    // Invalidate the OTP after successful reset
    await OTP.deleteMany({ email });
    
    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
