import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { AuthFrame } from "./Login.jsx";

export function RegisterPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Konfirmasi kata sandi belum sama.");
      return;
    }
    setBusy(true);
    try {
      const data = await api("/api/auth/register", {
        method: "POST",
        body: { name, email, password },
      });
      setSession(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthFrame
      title="Buat akun belajar"
      lead="Registrasi diperlukan sebelum membuka materi dan fitur pembelajaran."
    >
      <form className="form" onSubmit={onSubmit}>
        <label>
          Nama
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Kata sandi
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </label>
        <label>
          Ulangi kata sandi
          <input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            minLength={6}
            required
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary" type="submit" disabled={busy}>
          {busy ? "Mendaftarkan..." : "Daftar dan masuk"}
        </button>
      </form>
      <p className="switch-auth">
        Sudah punya akun? <Link to="/login">Masuk</Link>
      </p>
    </AuthFrame>
  );
}
