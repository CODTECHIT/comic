import mongoose from "mongoose";

const adBannerSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    linkUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const AdBanner = mongoose.model("AdBanner", adBannerSchema);
export default AdBanner;
