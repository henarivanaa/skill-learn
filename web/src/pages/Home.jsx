import { useEffect, useState } from "react";
import { ApiError, api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { MaterialCard } from "../components/MaterialCard.jsx";
import { categories } from "../labels.js";

export function HomePage() {
  const { token, user, logout } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [materialData, historyData] = await Promise.all([
          api("/api/materials", { token }),
          api("/api/history", { token }),
        ]);
        if (cancelled) return;
        setMaterials(materialData.materials);
        setHistory(historyData.items);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) logout();
        else setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  const favoriteIds = new Set(materials.filter((item) => item.favorited).map((item) => item.id));
  const visible = materials.filter((material) => {
    if (favoritesOnly && !material.favorited) return false;
    if (filter !== "all" && material.category !== filter) return false;
    const haystack = `${material.title} ${material.summary}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <div className="home">
      <section className="hero">
        <div>
          <p className="eyebrow">Halo, {user?.name?.split(" ")[0]}</p>
          <h1>Pilih keterampilan yang ingin kamu latih.</h1>
        </div>
        <label className="search">
          <span className="sr-only">Cari materi</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari judul atau ringkasan"
          />
        </label>
      </section>

      {history.length > 0 ? (
        <section className="continue">
          <h2>Lanjutkan belajar</h2>
          <div className="continue-row">
            {history.map((item) => (
              <MaterialCard
                key={item.material.id}
                material={{ ...item.material, favorited: favoriteIds.has(item.material.id) }}
              />
            ))}
          </div>
        </section>
      ) : null}

      <div className="filters">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={filter === category.id && !favoritesOnly ? "chip active" : "chip"}
            onClick={() => {
              setFilter(category.id);
              setFavoritesOnly(false);
            }}
          >
            {category.label}
          </button>
        ))}
        <button
          type="button"
          className={favoritesOnly ? "chip active" : "chip"}
          onClick={() => setFavoritesOnly((value) => !value)}
        >
          Favorit
        </button>
      </div>

      {error ? <p className="form-error">{error}</p> : null}
      {loading ? <p className="status">Memuat materi...</p> : null}
      {!loading && visible.length === 0 ? (
        <p className="status">Tidak ada materi pada saringan ini.</p>
      ) : null}

      <section className="grid">
        {visible.map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))}
      </section>
    </div>
  );
}
