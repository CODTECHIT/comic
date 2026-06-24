import express from "express";
import AdBanner from "../models/AdBanner.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { validateRequest, adBannerSchema } from "../middleware/validateMiddleware.js";

const router = express.Router();

// Get the active ad banner
router.get("/", async (req, res) => {
  try {
    const banner = await AdBanner.findOne().sort({ createdAt: -1 });
    res.json(banner || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update or create the ad banner
router.put("/", protectAdmin, validateRequest(adBannerSchema), async (req, res) => {
  try {
    const { imageUrl, linkUrl, isActive } = req.body;
    let banner = await AdBanner.findOne();
    
    if (banner) {
      banner.imageUrl = imageUrl;
      banner.linkUrl = linkUrl !== undefined ? linkUrl : banner.linkUrl;
      banner.isActive = isActive !== undefined ? isActive : banner.isActive;
      await banner.save();
    } else {
      banner = await AdBanner.create({ imageUrl, linkUrl, isActive });
    }
    
    res.json(banner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
