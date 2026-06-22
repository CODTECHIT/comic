import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comicId: { type: mongoose.Schema.Types.ObjectId, ref: "Comic", required: false },
    userName: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    status: { type: String, enum: ["approved", "hidden"], default: "approved" },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
