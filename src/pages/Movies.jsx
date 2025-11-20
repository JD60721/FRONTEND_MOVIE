import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Card, Grid } from "../components/ui.jsx";

export default function Movies() {
  const navigate = useNavigate();
  const API = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  const [query, setQuery] = useState("");
  const [films, setFilms] = useState([]);
  const [filmsPage, setFilmsPage] = useState(1);
  const [filmsTotalPages, setFilmsTotalPages] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [favPage, setFavPage] = useState(1);
  const [favTotalPages, setFavTotalPages] = useState(1);
  const [token] = useState(() => localStorage.getItem("token") || "");
  const loading = useMemo(() => films === null, [films]);

  function authHeaders() {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  async function loadFilms(q, page = 1) {
    setFilms(null);
    const r = await fetch(`${API}/api/films?q=${encodeURIComponent(q || "")}&page=${page}`, { headers: authHeaders() });
    const data = await r.json();
    if (Array.isArray(data)) {
      setFilms(data);
      setFilmsPage(1);
      setFilmsTotalPages(1);
    } else {
      setFilms(data.items || []);
      setFilmsPage(data.page || 1);
      setFilmsTotalPages(data.totalPages || 1);
    }
  }

  async function loadFavorites(page = 1, limit = 10) {
    try {
      const r = await fetch(`${API}/api/favorites?page=${page}&limit=${limit}`, { headers: authHeaders() });
      if (!r.ok) return;
      const data = await r.json();
      if (Array.isArray(data)) {
        setFavorites(data);
        setFavPage(1);
        setFavTotalPages(1);
      } else {
        setFavorites(data.items || []);
        setFavPage(data.page || 1);
        setFavTotalPages(data.totalPages || 1);
      }
    } catch {}
  }

  async function addFavorite(f) {
    try {
      const r = await fetch(`${API}/api/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          title: f.title,
          description: f.description,
          poster: f.poster,
          releaseDate: f.releaseDate,
          tmdbId: f.id
        })
      });
      if (!r.ok) return;
      const doc = await r.json();
      setFavorites((prev) => [doc, ...prev]);
    } catch {}
  }

  async function removeFavorite(id) {
    try {
      const r = await fetch(`${API}/api/favorites/${id}`, { method: "DELETE", headers: authHeaders() });
      if (!r.ok) return;
      setFavorites((prev) => prev.filter((x) => x._id !== id));
    } catch {}
  }

  useEffect(() => {
    loadFilms("", 1);
    loadFavorites(1, 10);
  }, []);

  return (
    <div className="container">
      <div className="topbar">
        <div className="title">Películas</div>
        <Button onClick={logout}>Cerrar sesión</Button>
      </div>
      <div className="spacer" />
      <Input value={query} onChange={setQuery} placeholder="Buscar por título" />
      <div className="spacer" />
      <div className="row">
        <Button onClick={() => loadFilms(query, 1)} disabled={loading}>Buscar</Button>
      </div>

      <div className="subtitle">Resultados</div>
      {loading && <div>Cargando...</div>}
      {!loading && films && films.length === 0 && <div>Sin resultados</div>}
      <Grid>
        {Array.isArray(films) && films.map((f) => (
          <Card key={f.id}>
            {f.poster && (
              <img className="poster" src={f.poster} alt={f.title} />
            )}
            <div className="card-body">
              <div style={{ fontWeight: 600 }}>{f.title}</div>
              <div className="text-muted">{f.releaseDate}</div>
              <div className="spacer" />
              <div>{(f.description || "").slice(0, 120)}...</div>
              <div className="spacer" />
              <Button onClick={() => addFavorite(f)}>Favorito</Button>
            </div>
          </Card>
        ))}
      </Grid>
      <div className="pagination">
        <Button disabled={filmsPage <= 1 || loading} onClick={() => loadFilms(query, filmsPage - 1)}>Anterior</Button>
        <span className="badge">Página {filmsPage} de {filmsTotalPages}</span>
        <Button disabled={filmsPage >= filmsTotalPages || loading} onClick={() => loadFilms(query, filmsPage + 1)}>Siguiente</Button>
      </div>

      <div className="subtitle">Favoritos</div>
      {favorites.length === 0 && <div>No hay favoritos</div>}
      <div>
        {favorites.map((f) => (
          <div key={f._id} style={{ display: "flex", alignItems: "center", padding: 8, borderBottom: "1px solid #1f2937" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{f.title}</div>
              <div className="text-muted">{f.releaseDate}</div>
            </div>
            <Button onClick={() => removeFavorite(f._id)}>Eliminar</Button>
          </div>
        ))}
      </div>
      <div className="pagination">
        <Button disabled={favPage <= 1} onClick={() => loadFavorites(favPage - 1)}>Anterior</Button>
        <span className="badge">Página {favPage} de {favTotalPages}</span>
        <Button disabled={favPage >= favTotalPages} onClick={() => loadFavorites(favPage + 1)}>Siguiente</Button>
      </div>
    </div>
  );
}