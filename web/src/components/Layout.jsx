import { Link } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            S
          </span>
          <span>
            <strong>SkillLearn</strong>
            <small>Keterampilan praktis di luar kelas</small>
          </span>
        </Link>
        <div className="topbar-user">
          <span className="user-name">{user?.name}</span>
          <button className="text-button" type="button" onClick={logout}>
            Keluar
          </button>
        </div>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}
