import express from "express";
import HeroSlide from "../models/HeroSlide.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { validateRequest, heroSlideSchema, idParamSchema } from "../middleware/validateMiddleware.js";

const router = express.Router();

// Get all hero slides
router.get("/", async (req, res) => {
  try {
    const slides = await HeroSlide.find({}).sort({ createdAt: -1 });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new hero slide
router.post("/", protectAdmin, validateRequest(heroSlideSchema), async (req, res) => {
  try {
    const slide = await HeroSlide.create(req.body);
    res.status(201).json(slide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a hero slide
router.delete("/:id", protectAdmin, validateRequest(idParamSchema), async (req, res) => {
  try {
    await HeroSlide.findByIdAndDelete(req.params.id);
    res.json({ message: "Slide deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
