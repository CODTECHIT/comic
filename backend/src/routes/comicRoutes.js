import express from "express";
import Comic from "../models/Comic.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { validateRequest, createComicSchema, idParamSchema } from "../middleware/validateMiddleware.js";

const router = express.Router();

// Create a comic
router.post("/", protectAdmin, validateRequest(createComicSchema), async (req, res) => {
  try {
    const comic = new Comic(req.body);
    const createdComic = await comic.save();
    res.status(201).json(createdComic);
  } catch (error) {
    console.error("Error creating comic:", error);
    res.status(400).json({ message: "Failed to create comic", error: error.message });
  }
});

// Get all comics — paginated to prevent DoS from huge response
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const skip = (page - 1) * limit;
    const comics = await Comic.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json(comics);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Get comic by ID
router.get("/:id", validateRequest(idParamSchema), async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic) return res.status(404).json({ message: "Comic not found" });
    res.json(comic);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Update comic
router.put("/:id", protectAdmin, validateRequest(idParamSchema), async (req, res) => {
  try {
    const comic = await Comic.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!comic) return res.status(404).json({ message: "Comic not found" });
    res.json(comic);
  } catch (error) {
    res.status(400).json({ message: "Failed to update comic", error: error.message });
  }
});

// Delete comic
router.delete("/:id", protectAdmin, validateRequest(idParamSchema), async (req, res) => {
  try {
    const comic = await Comic.findByIdAndDelete(req.params.id);
    if (!comic) return res.status(404).json({ message: "Comic not found" });
    res.json({ message: "Comic deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comic", error: error.message });
  }
});

export default router;
