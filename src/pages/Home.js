import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import AdBanner from "../components/AdBanner";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingSeries, setLoadingSeries] = useState(true);

  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const snap = await getDocs(collection(db, "movies"));
        const list = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data(), type: "movie" }))
          .sort((a, b) => (b.year || 0) - (a.year || 0));
        setMovies(list);
      } catch (err) {
        console.error("Erreur chargement films:", err);
      } finally {
        setLoadingMovies(false);
      }
    };

    const loadSeries = async () => {
      try {
        const snap = await getDocs(collection(db, "series"));
        const list = [];
        snap.docs.forEach(doc => {
          const data = doc.data();
          if (data.seasons && data.seasons.length > 0) {
            const season = data.seasons[0];
            if (season.episodes && season.episodes.length > 0) {
              const ep = season.episodes[0];
              list.push({ id: ep.id || ep.title, ...ep, type: "series" });
            }
          }
        });
        list.sort((a, b) => (b.year || 0) - (a.year || 0));
        setSeries(list);
      } catch (err) {
        console.error("Erreur chargement séries:", err);
      } finally {
        setLoadingSeries(false);
      }
    };

    loadMovies();
    loadSeries();
  }, []);

  const combined = useMemo(() => [...movies, ...series], [movies, series]);

  useEffect(() => {
    if (combined.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % combined.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [combined]);

  const goPrev = () =>
    setCurrentIndex(prev => (prev === 0 ? combined.length - 1 : prev - 1));
  const goNext = () => setCurrentIndex(prev => (prev + 1) % combined.length);

  const styles = {
    container: { backgroundColor: "#121212", minHeight: "100vh", overflowX: "hidden" },
    carouselWrapper: { position: "relative", width: "100%", height: "300px", overflow: "hidden" },
    carouselInner: { display: "flex", transition: "transform 1s ease-in-out", height: "100%" },
    carouselItem: { minWidth: "100%", height: "100%", position: "relative", flexShrink: 0 },
    heroImage: { width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" },
    watchButton: {
      position: "absolute",
      bottom: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "10px 20px",
      backgroundColor: "#ff0000",
      color: "#fff",
      borderRadius: "6px",
      textDecoration: "none",
      fontWeight: "bold",
    },
    arrow: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      background: "rgba(0,0,0,0.5)",
      color: "#fff",
      border: "none",
      fontSize: "24px",
      padding: "8px 12px",
      cursor: "pointer",
      borderRadius: "50%",
      zIndex: 10,
    },
    prevArrow: { left: "10px" },
    nextArrow: { right: "10px" },
    sectionTitle: { margin: "16px 16px 8px", color: "#fff" },
    horizontalScroll: {
      display: "flex",
      gap: "8px",
      paddingBottom: "10px",
      paddingLeft: "16px",
      paddingRight: "16px",
      overflowX: "auto",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    horizontalScrollHide: { '&::-webkit-scrollbar': { display: "none" } },
    card: { minWidth: "140px", flexShrink: 0, padding: "5px" },
    cardImage: { width: "140px", height: "200px", borderRadius: "8px", objectFit: "cover", cursor: "pointer" },
    cardTitle: { marginTop: "4px", fontSize: "12px", color: "#fff", textAlign: "center" },
  };

  return (
    <div style={styles.container}>
      {/* Carrousel */}
      {combined.length > 0 && (
        <div style={styles.carouselWrapper}>
          <div style={{ ...styles.carouselInner, transform: `translateX(-${currentIndex * 100}%)` }} ref={carouselRef}>
            {combined.map(item => (
              <div key={item.id} style={styles.carouselItem}>
                <Link to={`/detail/${item.type}/${item.id}`}>
                  <img src={item.imageUrl} alt={item.title} style={styles.heroImage} />
                </Link>
                <Link to={`/detail/${item.type}/${item.id}`} style={styles.watchButton}>Watch Now</Link>
              </div>
            ))}
          </div>
          <button onClick={goPrev} style={{ ...styles.arrow, ...styles.prevArrow }}>‹</button>
          <button onClick={goNext} style={{ ...styles.arrow, ...styles.nextArrow }}>›</button>
        </div>
      )}

      {/* PUB Native Banner sous carrousel */}
      <AdBanner containerId="ad-home-top" />

      {/* Films populaires */}
      <h2 style={styles.sectionTitle}>Films populaires</h2>
      {loadingMovies ? (
        <p style={{ color: "#bbb" }}>Chargement des films...</p>
      ) : (
        <div style={{ ...styles.horizontalScroll, ...styles.horizontalScrollHide }}>
          {movies.slice(0, 10).map(movie => (
            <div key={movie.id} style={styles.card}>
              <Link to={`/detail/movie/${movie.id}`}>
                <img src={movie.imageUrl} alt={movie.title} style={styles.cardImage} />
              </Link>
              <p style={styles.cardTitle}>{movie.title}</p>
            </div>
          ))}
        </div>
      )}

      {/* PUB Native Banner entre films et séries */}
      <AdBanner containerId="ad-home-middle" />

      {/* Séries populaires */}
      <h2 style={styles.sectionTitle}>Séries populaires</h2>
      {loadingSeries ? (
        <p style={{ color: "#bbb" }}>Chargement des séries...</p>
      ) : (
        <div style={{ ...styles.horizontalScroll, ...styles.horizontalScrollHide }}>
          {series.slice(0, 10).map(serie => (
            <div key={serie.id} style={styles.card}>
              <Link to={`/detail/series/${serie.id}`}>
                <img src={serie.imageUrl} alt={serie.title} style={styles.cardImage} />
              </Link>
              <p style={styles.cardTitle}>{serie.title}</p>
            </div>
          ))}
        </div>
      )}

      {/* PUB Native Banner Footer */}
      <AdBanner containerId="ad-home-bottom" />
    </div>
  );
}
