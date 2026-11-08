import { Router } from "express";
import { History } from "../models/History.js";
import { requireAuth } from "../middleware/auth.js";
import { toPublicMaterial } from "../models/Material.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const rows = await History.find({ userId: req.userId })
    .sort({ lastViewedAt: -1 })
    .limit(8)
    .populate("materialId");

  const items = rows
    .filter((row) => row.materialId)
    .map((row) => ({
      lastViewedAt: row.lastViewedAt,
      material: toPublicMaterial(row.materialId, false),
    }));

  res.json({ items });
});

export default router;
