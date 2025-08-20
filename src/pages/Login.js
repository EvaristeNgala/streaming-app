// src/pages/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // redirection vers l'accueil après connexion
    } catch (err) {
      setError("Email ou mot de passe incorrect");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#121212",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        padding: 20,
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#1f1f1f",
          padding: 30,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Connexion</h2>

        {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "92%",
            padding: "10px 12px",
            marginBottom: 15,
            borderRadius: 6,
            border: "1px solid #333",
            background: "#121212",
            color: "#fff",
          }}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "92%",
            padding: "10px 12px",
            marginBottom: 15,
            borderRadius: 6,
            border: "1px solid #333",
            background: "#121212",
            color: "#fff",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 6,
            border: "none",
            background: "#ff3d00",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <p style={{ textAlign: "center", marginTop: 15 }}>
          Pas encore inscrit ?{" "}
          <Link
            to="/register"
            style={{ color: "#ff3d00", fontWeight: "bold", textDecoration: "none" }}
          >
            S’inscrire
          </Link>
        </p>
      </form>
    </div>
  );
}
