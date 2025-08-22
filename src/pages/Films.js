// src/pages/Films.js
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // vérifie le chemin selon ton projet

export default function Films() {
  const [films, setFilms] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    const load = async () => {
      setLoading(true);
      try {
        unsubscribe = onSnapshot(
          collection(db, "movies"),
          (snap) => {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            console.log("movies snapshot:", list);
            setFilms(list);
            setLoading(false);
          },
          (err) => {
            console.error("onSnapshot error:", err);
            setLoading(false);
          }
        );
      } catch (err) {
        console.warn("onSnapshot failed, fallback to getDocs:", err);
        try {
          const snap = await getDocs(collection(db, "movies"));
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          console.log("movies getDocs fallback:", list);
          setFilms(list);
        } catch (e) {
          console.error("getDocs fallback error:", e);
        } finally {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const normalized = (s) => (s || "").toString().toLowerCase();
  const filtered = films.filter(
    (f) =>
      normalized(f.title).includes(normalized(search)) ||
      normalized(f.description).includes(normalized(search))
  );

  return (
    <div style={{ background: "#121212", minHeight: "100vh", color: "#fff", padding: 20 }}>
      {/* Barre de recherche */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#121212",
          padding: "10px 0",
          borderBottom: "1px solid #333"
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un film..."
          style={{
            width: "95%",
            padding: "10px 12px",
            margin: "0 auto",
            display: "block",
            borderRadius: 8,
            border: "1px solid #333",
            background: "#1f1f1f",
            color: "#fff",
          }}
        />
      </div>

      {loading ? (
        <p style={{ color: "#bbb" }}>Chargement…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "#bbb" }}>Aucun film trouvé.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // 🔥 forcer 2 colonnes minimum
            gap: 16,
          }}
        >
          {filtered.map((film) => (
            <article
              key={film.id}
              style={{
                background: "#181818",
                borderRadius: 8,
                overflow: "hidden",
                cursor: film.videoUrl ? "pointer" : "default",
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
              onClick={() => {
                if (film.videoUrl) window.open(film.videoUrl, "_blank", "noopener");
              }}
            >
              <div style={{ width: "100%", height: 220, background: "#222" }}>
                {film.imageUrl ? (
                  <img
                    src={film.imageUrl}
                    alt={film.title || "poster"}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#888",
                    }}
                  >
                    Pas d'image
                  </div>
                )}
              </div>
              <div style={{ padding: 10 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#fff",
                    textTransform: "capitalize",
                  }}
                >
                  {film.title || "Titre inconnu"}
                </h3>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "#bbb" }}>
                  {film.genre ? `${film.genre}${film.year ? " • " + film.year : ""}` : film.year || ""}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
