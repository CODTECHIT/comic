import express from "express";
import Subscription from "../models/Subscription.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { validateRequest, subscriptionSchema, idParamSchema } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Return all plans sorted by display order
    const items = await Subscription.find({}).sort({ display_order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ONLY allow updates to specific fields
router.put("/:id", protectAdmin, validateRequest(subscriptionSchema), async (req, res) => {
  try {
    // Only extract the allowed fields
    const { price, description, features, is_active, is_popular, display_order } = req.body;
    
    const updateData = {};
    if (price !== undefined) updateData.price = price;
    if (description !== undefined) updateData.description = description;
    if (features !== undefined) updateData.features = features;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (is_popular !== undefined) updateData.is_popular = is_popular;
    if (display_order !== undefined) updateData.display_order = display_order;

    const item = await Subscription.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData }, 
      { new: true, runValidators: true }
    );
    
    if (!item) return res.status(404).json({ message: "Subscription not found" });
    
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
