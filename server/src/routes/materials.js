import { Router } from "express";
import { Favorite } from "../models/Favorite.js";
import { History } from "../models/History.js";
import { Material, toPublicMaterial } from "../models/Material.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

async function favoriteIdSet(userId) {
  const rows = await Favorite.find({ userId }).select("materialId");
  return new Set(rows.map((row) => row.materialId.toString()));
}

router.get("/", async (req, res) => {
  const materials = await Material.find().sort({ createdAt: 1 });
  const favorites = await favoriteIdSet(req.userId);
  res.json({
    materials: materials.map((material) =>
      toPublicMaterial(material, favorites.has(material._id.toString()))
    ),
  });
});

router.get("/:id", async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) {
    return res.status(404).json({ message: "Materi tidak ditemukan." });
  }
  const favorited = await Favorite.exists({ userId: req.userId, materialId: material._id });
  res.json({ material: toPublicMaterial(material, Boolean(favorited)) });
});

router.post("/:id/favorite", async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) {
    return res.status(404).json({ message: "Materi tidak ditemukan." });
  }
  await Favorite.updateOne(
    { userId: req.userId, materialId: material._id },
    { $setOnInsert: { userId: req.userId, materialId: material._id } },
    { upsert: true }
  );
  res.json({ favorited: true });
});

router.delete("/:id/favorite", async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) {
    return res.status(404).json({ message: "Materi tidak ditemukan." });
  }
  await Favorite.deleteOne({ userId: req.userId, materialId: material._id });
  res.json({ favorited: false });
});

router.post("/:id/history", async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) {
    return res.status(404).json({ message: "Materi tidak ditemukan." });
  }
  await History.findOneAndUpdate(
    { userId: req.userId, materialId: material._id },
    { lastViewedAt: new Date() },
    { upsert: true, new: true }
  );
  res.json({ saved: true });
});

router.post("/:id/quiz", async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material || material.type !== "quiz") {
    return res.status(404).json({ message: "Kuis tidak ditemukan." });
  }
  const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
  const results = material.questions.map((question, index) => ({
    correct: answers[index] === question.answerIndex,
    answerIndex: question.answerIndex,
  }));
  const score = results.filter((item) => item.correct).length;
  res.json({ score, total: results.length, results });
});

export default router;
