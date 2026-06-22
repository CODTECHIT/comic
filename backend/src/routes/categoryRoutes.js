import express from "express";
import Category from "../models/Category.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { validateRequest, categorySchema, idParamSchema } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await Category.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", protectAdmin, validateRequest(categorySchema), async (req, res) => {
  try {
    const item = await Category.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", protectAdmin, validateRequest(idParamSchema), async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
