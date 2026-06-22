import mongoose from "mongoose";

const comicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    synopsis: { type: String, required: true },
    creator: { type: String, default: "Lekhyas Studio" },
    issuesInfo: { type: String, default: "March, June, Sep" },
    pageCount: { type: String, default: "48 avg" },
    category: { type: String, required: true },
    audience: { type: String, default: "all" },
    price: { type: Number, required: true },
    coverImage: { type: String, required: true }, // Cloudinary URL
    pages: [{ type: String, required: true }],    // Cloudinary URLs
    pdfUrl: { type: String },                     // Cloudinary PDF URL
    status: { type: String, enum: ["published", "draft"], default: "draft" },
  },
  { timestamps: true }
);

const Comic = mongoose.model("Comic", comicSchema);

export default Comic;
