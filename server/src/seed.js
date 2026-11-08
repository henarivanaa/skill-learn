import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "./db.js";
import { materials } from "./data/materials.js";
import { Favorite } from "./models/Favorite.js";
import { History } from "./models/History.js";
import { Material } from "./models/Material.js";
import { User } from "./models/User.js";

const demoEmail = "demo@skilllearn.id";

export async function ensureDemoUser() {
  const existing = await User.findOne({ email: demoEmail });
  if (existing) return existing;
  return User.create({
    name: "Demo Siswa",
    email: demoEmail,
    passwordHash: await bcrypt.hash("demo1234", 10),
  });
}

export async function ensureSeed() {
  const count = await Material.countDocuments();
  if (count === 0) {
    await Material.insertMany(materials);
    console.log(`Materi awal dimasukkan: ${materials.length}`);
  }
  await ensureDemoUser();
}

export async function resetMaterials() {
  await Promise.all([Material.deleteMany({}), Favorite.deleteMany({}), History.deleteMany({})]);
  await Material.insertMany(materials);
  await ensureDemoUser();
  console.log(`Materi direset: ${materials.length}`);
}

const entry = process.argv[1] || "";
if (entry.endsWith("seed.js")) {
  await connectDb(process.env.MONGODB_URI);
  await resetMaterials();
  await mongoose.disconnect();
}
