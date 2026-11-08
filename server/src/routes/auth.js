import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { publicUser, signToken } from "../middleware/auth.js";

const router = Router();

function readCredentials(body) {
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  return { name, email, password };
}

router.post("/register", async (req, res) => {
  const { name, email, password } = readCredentials(req.body);
  if (name.length < 2) {
    return res.status(400).json({ message: "Nama minimal 2 karakter." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Email tidak valid." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Kata sandi minimal 6 karakter." });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email sudah terdaftar." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  return res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = readCredentials(req.body);
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan kata sandi wajib diisi." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email atau kata sandi salah." });
  }
  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return res.status(401).json({ message: "Email atau kata sandi salah." });
  }

  return res.json({ token: signToken(user), user: publicUser(user) });
});

export default router;
