import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

export function LoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: { email, password },
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
      title="Masuk ke ruang belajar"
      lead="Materi, kuis, dan latihan terbuka setelah akunmu dikenali."
    >
      <form className="form" onSubmit={onSubmit}>
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
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary" type="submit" disabled={busy}>
          {busy ? "Memeriksa..." : "Masuk"}
        </button>
      </form>
      <p className="switch-auth">
        Belum punya akun? <Link to="/daftar">Daftar</Link>
      </p>
      <p className="demo-note">
        Akun contoh: <code>demo@skilllearn.id</code> / <code>demo1234</code>
      </p>
    </AuthFrame>
  );
}

export function AuthFrame({ title, lead, children }) {
  return (
    <div className="auth-screen">
      <section className="auth-story">
        <p className="eyebrow">SkillLearn</p>
        <h1>Belajar keterampilan yang bisa langsung dipakai.</h1>
        <p>
          Artikel, video, kuis, dan latihan pada pemrograman, desain grafis, digital marketing, dan
          teknologi.
        </p>
        <ul>
          <li>Simpan materi favorit</li>
          <li>Lanjutkan dari riwayat belajar</li>
          <li>Satu akun untuk web dan ponsel</li>
        </ul>
      </section>
      <section className="auth-panel">
        <h2>{title}</h2>
        <p className="lead">{lead}</p>
        {children}
      </section>
    </div>
  );
}
