import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDb } from "./db.js";
import { ensureSeed } from "./seed.js";
import authRoutes from "./routes/auth.js";
import materialRoutes from "./routes/materials.js";
import favoriteRoutes from "./routes/favorites.js";
import historyRoutes from "./routes/history.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "skilllearn-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/history", historyRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.status || 500;
  res.status(status).json({ message: status === 500 ? "Terjadi kesalahan server." : error.message });
});

const port = Number(process.env.PORT) || 4000;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET belum diisi.");
  process.exit(1);
}

await connectDb(process.env.MONGODB_URI);
await ensureSeed();

app.listen(port, () => {
  console.log(`SkillLearn API berjalan di http://localhost:${port}`);
});
