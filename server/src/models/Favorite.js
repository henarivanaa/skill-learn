import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    materialId: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, materialId: 1 }, { unique: true });

export const Favorite = mongoose.model("Favorite", favoriteSchema);
