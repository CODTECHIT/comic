import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    duration_months: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    features: [{ type: String }],
    is_active: { type: Boolean, default: true },
    is_popular: { type: Boolean, default: false },
    display_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
