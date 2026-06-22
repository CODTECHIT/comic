import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    genre: { type: String, required: true },
    price: { type: Number, required: true },
    badge: { type: String },
    accentColor: { type: String, required: true, default: "#C8181E" },
    img: { type: String, required: true },
  },
  { timestamps: true }
);

const HeroSlide = mongoose.model("HeroSlide", heroSlideSchema);
export default HeroSlide;
