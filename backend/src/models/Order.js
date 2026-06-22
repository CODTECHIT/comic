import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    itemType: { type: String, enum: ["comic", "subscription"], required: true },
    comicId: { type: mongoose.Schema.Types.ObjectId, ref: "Comic" },
    subscriptionName: { type: String },
    amount: { type: Number, required: true }, // Stored in rupees (INR)
    currency: { type: String, default: "INR" },
    razorpayOrderId: { type: String, required: true, index: true },
    razorpayPaymentId: { type: String, required: true, unique: true }, // unique = idempotency
    status: { type: String, enum: ["paid", "failed", "refunded"], default: "paid" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
