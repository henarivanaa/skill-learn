import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    options: { type: [String], required: true },
    answerIndex: { type: Number, required: true },
  },
  { _id: false }
);

const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["programming", "design", "marketing", "technology"],
    },
    type: {
      type: String,
      required: true,
      enum: ["article", "video", "quiz", "practice"],
    },
    level: { type: String, required: true, enum: ["pemula", "menengah"] },
    durationMin: { type: Number, required: true },
    summary: { type: String, required: true },
    body: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    steps: { type: [String], default: [] },
    questions: { type: [questionSchema], default: [] },
  },
  { timestamps: true }
);

export const Material = mongoose.model("Material", materialSchema);

export function toPublicMaterial(material, favorited = false) {
  const json = material.toObject ? material.toObject() : material;
  return {
    id: json._id.toString(),
    title: json.title,
    category: json.category,
    type: json.type,
    level: json.level,
    durationMin: json.durationMin,
    summary: json.summary,
    body: json.body,
    videoUrl: json.videoUrl,
    steps: json.steps,
    questions: (json.questions || []).map((question) => ({
      prompt: question.prompt,
      options: question.options,
    })),
    favorited,
  };
}
