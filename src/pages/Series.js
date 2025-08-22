// src/pages/Series.js
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import AdBanner from "../components/AdBanner";

export default function Series() {
  const [series, setSeries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe = () => {};

    const loadSeries = async () => {
      setLoading(true);
      try {
        unsubscribe = onSnapshot(
          collection(db, "series"),
          (snap) => {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setSeries(list);
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
          const snap = await getDocs(collection(db, "series"));
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setSeries(list);
        } catch (e) {
          console.error("getDocs fallback error:", e);
        } finally {
          setLoading(false);
        }
      }
    };

    loadSeries();
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const normalized = (s) => (s || "").toString().toLowerCase();
  const filtered = series.filter(
    (s) =>
      normalized(s.title).includes(normalized(search)) ||
      normalized(s.description).includes(normalized(search))
  );

  return (
    <div style={{ background: "#121212", minHeight: "100vh", color: "#fff", paddingBottom: 20 }}>
      {/* PUB Top */}
      <AdBanner containerId="ad-series-top" />

      {/* Barre de recherche sticky */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#121212",
          padding: "10px 0",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une série..."
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
        <p style={{ color: "#bbb", padding: 16 }}>Chargement…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "#bbb", padding: 16 }}>Aucune série trouvée.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 16,
            padding: 16,
          }}
        >
          {filtered.map((serie, index) => (
            <React.Fragment key={serie.id}>
              {/* PUB milieu tous les 6 séries */}
              {index > 0 && index % 6 === 0 && <AdBanner containerId={`ad-series-middle-${index}`} />}
              <article
                style={{
                  background: "#181818",
                  borderRadius: 8,
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
                onClick={() => navigate(`/detail/series/${serie.id}`)}
              >
                <div style={{ width: "100%", height: 220, background: "#222" }}>
                  {serie.imageUrl ? (
                    <img
                      src={serie.imageUrl}
                      alt={serie.title || "poster"}
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
                    {serie.title || "Titre inconnu"}
                  </h3>
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "#bbb" }}>
                    {serie.genre || ""}
                    {serie.year ? ` • ${serie.year}` : ""}
                  </p>
                </div>
              </article>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* PUB Footer */}
      <AdBanner containerId="ad-series-bottom" />
    </div>
  );
}
