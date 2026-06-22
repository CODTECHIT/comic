import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Allowed MIME types for uploads
const ALLOWED_MIME_TYPES = [
  "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif",
  "application/pdf"
];

// Setup Multer with memory storage, 50MB limit, and MIME type filter
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`), false);
    }
  }
});

// Admin-only upload route
router.post("/", protectAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Determine resource_type (auto handles pdfs vs images)
    const resourceType = req.file.mimetype === "application/pdf" ? "raw" : "auto";

    // Upload to Cloudinary using a stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "comics", resource_type: resourceType },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Upload failed", error: error.message });
        }
        res.json({ url: result.secure_url, public_id: result.public_id });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error("Server error during upload:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message?.includes("File type not allowed")) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

export default router;
