import express from "express";
import dotenv from "dotenv";

dotenv.config();

import jwt from "jsonwebtoken";

const router = express.Router();

import User from "../models/User.js";
import Order from "../models/Order.js";
import Comic from "../models/Comic.js";
import Subscription from "../models/Subscription.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const generateAdminToken = (res, role, id = null) => {
  const token = jwt.sign({ role, id }, process.env.JWT_SECRET, { expiresIn: "30d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token; // return for Bearer header use by frontend
};

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check DB first — admin users with role: "admin"
    const adminUser = await User.findOne({ email, role: "admin" });
    if (adminUser && (await adminUser.matchPassword(password))) {
      const token = generateAdminToken(res, "admin", adminUser._id);
      return res.json({ message: "Admin logged in successfully", token });
    }

    // Fallback to Env credentials for initial setup
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = generateAdminToken(res, "admin");
      return res.json({ message: "Admin logged in successfully", token });
    } 

    res.status(401).json({ message: "Invalid admin credentials" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc  Verify admin is still authenticated (cookie or token check)
// @route GET /api/v1/admin/me
// @access Private/Admin
router.get("/me", (req, res) => {
  const bearerToken = req.headers?.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null;
  const token = bearerToken || req.cookies?.jwt;
  
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ message: "Not admin" });
    res.json({ authenticated: true, role: decoded.role });
  } catch (error) {
    console.error("JWT Verify Error in /me:", error.message);
    res.status(401).json({ message: "Token invalid or expired", error: error.message });
  }
});

// @desc  Get admin dashboard stats
// @route GET /api/v1/admin/stats
// @access Private/Admin
router.get("/stats", protectAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const activeMemberships = await User.countDocuments({ subscriptionStatus: "active" });
    const expiredMemberships = await User.countDocuments({ subscriptionStatus: "inactive" });
    const booksSold = await Order.countDocuments({ itemType: "comic", status: "paid" });
    const subscriptionSales = await Order.countDocuments({ itemType: "subscription", status: "paid" });
    
    const revenueData = await Order.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;
    
    const mostPopularPlan = await Subscription.findOne({ is_popular: true }).select("name");

    res.json({
      totalUsers,
      activeMemberships,
      expiredMemberships,
      booksSold,
      subscriptionSales,
      totalRevenue,
      mostPopularPlan: mostPopularPlan ? mostPopularPlan.name : "None",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
});

import Contact from "../models/Contact.js";

// @desc  Get all contact form submissions
// @route GET /api/v1/admin/contacts
// @access Private/Admin
router.get("/contacts", protectAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contacts", error: error.message });
  }
});

// @desc  Update contact submission status
// @route PATCH /api/v1/admin/contacts/:id/status
// @access Private/Admin
router.patch("/contacts/:id/status", protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    contact.status = status;
    const updatedContact = await contact.save();

    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: "Failed to update contact status", error: error.message });
  }
});

export default router;
