import express from "express";
import { protectAdmin, protect } from "../middleware/authMiddleware.js";
import Comment from "../models/Comment.js";
import { validateRequest, createCommentSchema, updateCommentStatusSchema, idParamSchema } from "../middleware/validateMiddleware.js";

const router = express.Router();

// @desc    Get all comments (optionally filtered by status)
// @route   GET /api/v1/comments
// @access  Public
router.get("/", async (req, res) => {
  try {
    // Validate status query param if provided
    const allowedStatuses = ["approved", "hidden"];
    const filter = req.query.status && allowedStatuses.includes(req.query.status)
      ? { status: req.query.status }
      : {};
    const comments = await Comment.find(filter)
      .populate("comicId", "title")
      .sort({ createdAt: -1 })
      .limit(200); // safety limit: never return unbounded sets
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc    Create a new comment
// @route   POST /api/v1/comments
// @access  Private
router.post("/", protect, validateRequest(createCommentSchema), async (req, res) => {
  try {
    const { comicId, text, rating } = req.body;
    const comment = new Comment({ comicId, userName: req.user.username, text, rating });
    const createdComment = await comment.save();
    res.status(201).json(createdComment);
  } catch (error) {
    res.status(400).json({ message: "Invalid comment data", error: error.message });
  }
});

// @desc    Update comment status (hide/approve)
// @route   PUT /api/v1/comments/:id/status
// @access  Private/Admin
router.put("/:id/status", protectAdmin, validateRequest(updateCommentStatusSchema), async (req, res) => {
  try {
    const { status } = req.body;
    const comment = await Comment.findById(req.params.id);
    if (comment) {
      comment.status = status;
      const updatedComment = await comment.save();
      res.json(updatedComment);
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid comment ID", error: error.message });
  }
});

// @desc    Delete a comment
// @route   DELETE /api/v1/comments/:id
// @access  Private/Admin
router.delete("/:id", protectAdmin, validateRequest(idParamSchema), async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment) {
      await comment.deleteOne();
      res.json({ message: "Comment removed" });
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid comment ID", error: error.message });
  }
});

export default router;
