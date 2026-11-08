import { Router } from "express";
import { Favorite } from "../models/Favorite.js";
import { requireAuth } from "../middleware/auth.js";
import { toPublicMaterial } from "../models/Material.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const rows = await Favorite.find({ userId: req.userId }).populate("materialId");
  const materials = rows
    .map((row) => row.materialId)
    .filter(Boolean)
    .map((material) => toPublicMaterial(material, true));
  res.json({ materials });
});

export default router;
