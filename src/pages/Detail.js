// src/pages/Detail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import AdBanner from "../components/AdBanner";

export default function Detail() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [allMovies, setAllMovies] = useState([]);

  // Charger les données depuis Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === "movie") {
          const docSnap = await getDoc(doc(db, "movies", id));
          if (docSnap.exists()) setItem({ id: docSnap.id, ...docSnap.data() });

          const moviesSnap = await getDocs(collection(db, "movies"));
          setAllMovies(moviesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } else if (type === "series") {
          const snap = await getDocs(collection(db, "series"));
          const seriesList = snap.docs.map(d => ({ id: d.id, ...d.data() }));

          let found = false;
          seriesList.forEach(data => {
            if (data.seasons) {
              data.seasons.forEach(season => {
                if (season.episodes) {
                  season.episodes.forEach(ep => {
                    if (ep.id === id) {
                      setItem({ ...data, selectedEpisode: ep });
                      setSelectedSeason(data.seasons[0] || null);
                      found = true;
                    }
                  });
                }
              });
            }
          });
          if (!found) {
            const seriesItem = seriesList.find(s => s.id === id) || null;
            setItem(seriesItem);
            if (seriesItem?.seasons?.length > 0) setSelectedSeason(seriesItem.seasons[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, id]);

  if (loading) return <p style={{ color: "#fff", padding: 20 }}>Chargement...</p>;
  if (!item) return <p style={{ color: "#fff", padding: 20 }}>Film ou série introuvable</p>;

  const styles = {
    container: { color: "#fff", backgroundColor: "#121212", minHeight: "100vh", padding: 10 },
    heroWrapper: { position: "relative", width: "100%", maxHeight: 300, overflow: "hidden" },
    hero: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
    backButton: { position: "absolute", top: 16, right: 16, padding: 10, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 18 },
    playButtonCenter: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 28, color: "#fff" },
    moviesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16, marginTop: 20 },
    movieCard: { background: "#1e1e1e", borderRadius: 8, overflow: "hidden", cursor: "pointer" },
    movieImage: { width: "100%", height: 180, objectFit: "cover", display: "block" },
    episodeCard: { display: "flex", flexDirection: "column", background: "#1e1e1e", margin: "12px 0", borderRadius: 8, padding: 10 },
    episodeImageWrapper: { position: "relative", width: "100%", height: 180, flexShrink: 0, marginBottom: 10 },
    episodeImage: { width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 },
    playBtnOverlay: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 20, color: "#fff" },
    modal: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    video: { width: "90%", height: "70%", maxWidth: 800, background: "#000" },
    closeBtn: { position: "absolute", top: 20, right: 20, fontSize: 24, color: "#fff", background: "transparent", border: "none", cursor: "pointer" },
  };

  const handlePlay = url => {
    if (window?.Profitableratecpm) {
      try { window.Profitableratecpm(); } catch (e) { console.error(e); }
    }
    setVideoUrl(url);
  };

  return (
    <>
      {videoUrl && (
        <div style={styles.modal}>
          <button style={styles.closeBtn} onClick={() => setVideoUrl(null)}>✖</button>
          <iframe src={videoUrl} style={styles.video} frameBorder="0" allow="autoplay; fullscreen" allowFullScreen title="video"></iframe>
        </div>
      )}

      <AdBanner containerId="ad-detail-top" />

      <div style={styles.heroWrapper}>
        <img src={item.imageUrl} alt={item.title} style={styles.hero} />
        <button style={styles.backButton} onClick={() => navigate(-1)}>←</button>
        {type === "movie" && item.videoUrl && (
          <button style={styles.playButtonCenter} onClick={() => handlePlay(item.videoUrl)}>▶</button>
        )}
      </div>

      <div style={styles.container}>
        <h1>{item.title}</h1>
        <p>{item.description}</p>

        {type === "movie" && allMovies.length > 0 && (
          <>
            <h2>Autres films</h2>
            <div style={styles.moviesGrid}>
              {allMovies.filter(m => m.id !== item.id).map((m, index) => (
                <React.Fragment key={m.id}>
                  {index > 0 && index % 6 === 0 && <AdBanner containerId={`ad-detail-middle-${index}`} />}
                  <div style={styles.movieCard} onClick={() => navigate(`/detail/movie/${m.id}`)}>
                    <img src={m.imageUrl} alt={m.title} style={styles.movieImage} />
                    <div style={{ padding: 8 }}><h4>{m.title}</h4></div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </>
        )}

        {type === "series" && selectedSeason?.episodes && (
          <>
            <select
              value={selectedSeason?.id || ""}
              onChange={e => setSelectedSeason(item.seasons.find(s => s.id === e.target.value))}
              style={{ padding: 8, marginBottom: 10, background: "#1e1e1e", color: "#fff", borderRadius: 6 }}
            >
              {item.seasons?.map(season => (
                <option key={season.id} value={season.id}>{season.name}</option>
              ))}
            </select>

            <h3>Épisodes</h3>
            {selectedSeason.episodes.map((ep, index) => (
              <React.Fragment key={ep.id}>
                {index > 0 && index % 4 === 0 && <AdBanner containerId={`ad-detail-ep-${index}`} />}
                <div style={styles.episodeCard}>
                  <div style={styles.episodeImageWrapper}>
                    <img src={ep.imageUrl} alt={ep.title} style={styles.episodeImage} />
                    {ep.videoUrl && <button style={styles.playBtnOverlay} onClick={() => handlePlay(ep.videoUrl)}>▶</button>}
                  </div>
                  <h4>{ep.title}</h4>
                  <p>{ep.description}</p>
                </div>
              </React.Fragment>
            ))}
          </>
        )}
      </div>

      <AdBanner containerId="ad-detail-bottom" />
    </>
  );
}
