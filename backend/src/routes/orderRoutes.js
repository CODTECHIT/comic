import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";
import { validateRequest, createOrderSchema, verifyOrderSchema } from "../middleware/validateMiddleware.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Comic from "../models/Comic.js";
import Subscription from "../models/Subscription.js";
import { sendBookPurchaseEmail, sendMembershipPurchaseEmail } from "../services/emailService.js";

const router = express.Router();

// Initialize Razorpay — requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in process.env
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// @desc    Create a Razorpay order — price is ALWAYS fetched from DB, never trusted from client
// @route   POST /api/v1/orders/create
// @access  Private
router.post("/create", protect, validateRequest(createOrderSchema), async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ message: "Razorpay is not configured on the server." });
    }

    const { comicIds, planName, currency } = req.body;

    let amount = 0;
    let receipt = `receipt_${Date.now()}`;

    if (comicIds && comicIds.length > 0) {
      // Fetch real prices from DB — never trust client amount
      const comics = await Comic.find({ _id: { $in: comicIds } }).select("price title");
      if (comics.length !== comicIds.length) {
        return res.status(400).json({ message: "One or more comics not found" });
      }
      amount = comics.reduce((sum, c) => sum + c.price, 0);
      receipt = `comics_${Date.now()}`;
    } else if (planName) {
      // Fetch real subscription price from DB
      const plan = await Subscription.findOne({ name: planName, is_active: true }).select("price");
      if (!plan) {
        return res.status(400).json({ message: "Subscription plan not found or is inactive" });
      }
      amount = plan.price;
      receipt = `sub_${Date.now()}`;
    } else {
      return res.status(400).json({ message: "Provide comicIds or planName" });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: currency || "INR",
      receipt,
    };

    const order = await razorpay.orders.create(options);
    // Return explicit properties and trim the key_id to prevent trailing whitespace/newline issues from Windows .env files
    res.json({ 
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID.trim() 
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message || error });
  }
});

// @desc    Verify Razorpay payment + unlock content
// @route   POST /api/v1/orders/verify
// @access  Private
router.post("/verify", protect, validateRequest(verifyOrderSchema), async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, comicIds, planName } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return res.status(500).json({ message: "Razorpay secret not configured" });

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature", success: false });
    }

    // --- Idempotency Check --- prevent duplicate processing
    const existingOrder = await Order.findOne({ razorpayPaymentId: razorpay_payment_id });
    if (existingOrder) {
      return res.json({ message: "Payment already processed", success: true });
    }

    // Payment verified — update user and create order records
    const user = await User.findById(req.user._id);
    const idsToProcess = comicIds || [];

    if (idsToProcess.length > 0) {
      // Fetch real prices from DB for accurate order records
      const comics = await Comic.find({ _id: { $in: idsToProcess } }).select("price title");
      const priceMap = {};
      comics.forEach(c => { priceMap[c._id.toString()] = c.price; });

      // Add comics to user's purchased list (no duplicates)
      idsToProcess.forEach(id => {
        if (!user.purchasedComics.map(x => x.toString()).includes(id.toString())) {
          user.purchasedComics.push(id);
        }
      });
      await user.save();

      // Bulk insert order records — no N+1 loop
      await Order.insertMany(
        idsToProcess.map(id => ({
          user: req.user._id,
          itemType: "comic",
          comicId: id,
          subscriptionName: null,
          amount: priceMap[id.toString()] || 0, // accurate per-comic price
          currency: "INR",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: `${razorpay_payment_id}_${id}`, // unique per comic
          status: "paid",
        }))
      );

      // Send emails asynchronously (without awaiting)
      idsToProcess.forEach(id => {
        const comic = comics.find(c => c._id.toString() === id.toString());
        if (comic) {
          sendBookPurchaseEmail(user.email, comic.title, priceMap[id.toString()] || 0, razorpay_order_id);
        }
      });
    } else if (planName) {
      // Fetch real subscription plan to get duration and price
      const plan = await Subscription.findOne({ name: planName }).select("price duration_months");
      
      user.subscriptionName = planName;
      user.subscriptionStatus = "active";
      
      const now = new Date();
      let expiry;
      
      // If the user already has an active subscription, extend it.
      if (user.subscriptionExpiry && new Date(user.subscriptionExpiry) > now) {
        expiry = new Date(user.subscriptionExpiry);
        // Don't change the start date if they are just extending an active sub
        if (!user.subscriptionStart) {
          user.subscriptionStart = now;
        }
      } else {
        // Otherwise, start from now
        expiry = now;
        user.subscriptionStart = now;
      }
      
      // Add months instead of hardcoded 30 days
      const monthsToAdd = plan ? plan.duration_months : 1; 
      expiry.setMonth(expiry.getMonth() + monthsToAdd);

      // --- RACE CONDITION PREVENTION ---
      // We create the order FIRST. Because razorpayPaymentId is uniquely indexed,
      // if two concurrent requests hit this point at the exact same millisecond,
      // the database will reject the second one with an 11000 Duplicate Key Error
      // BEFORE it can modify and save the user's expiry date!
      await Order.create({
        user: req.user._id,
        itemType: "subscription",
        comicId: null,
        subscriptionName: planName,
        amount: plan ? plan.price : 0,
        currency: "INR",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        status: "paid",
      });
      
      user.subscriptionExpiry = expiry;
      await user.save();

      // Send email asynchronously
      sendMembershipPurchaseEmail(user.email, planName, user.subscriptionStart, user.subscriptionExpiry, plan ? plan.price : 0, razorpay_order_id);
    }

    res.json({ message: "Payment verified successfully", success: true });
  } catch (error) {
    // Duplicate key error (idempotency) — safe to ignore
    if (error.code === 11000) {
      return res.json({ message: "Payment already processed", success: true });
    }
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
});

// @desc    Razorpay Webhook — server-side payment confirmation (independent of browser)
// @route   POST /api/v1/orders/webhook
// @access  Public (signature-verified)
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(500).json({ message: "Webhook secret not configured" });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const event = JSON.parse(req.body.toString());
    console.log(`[Webhook] Received event: ${event.event}`);

    // Handle payment.captured — same as /verify but triggered by Razorpay server
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      console.log(`[Webhook] Payment captured: ${payment.id} for order: ${payment.order_id}`);
      // Full processing is handled by /verify on the frontend side.
      // Webhook can be used for additional reconciliation or email triggers.
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("[Webhook] Error:", error.message);
    res.status(500).json({ message: "Webhook processing failed" });
  }
});

// @desc    Get all orders for admin
// @route   GET /api/v1/orders/all
// @access  Private/Admin
router.get("/all", protectAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("comicId", "title")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

export default router;

