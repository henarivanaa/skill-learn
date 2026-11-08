import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    materialId: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
    lastViewedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

historySchema.index({ userId: 1, materialId: 1 }, { unique: true });

export const History = mongoose.model("History", historySchema);
