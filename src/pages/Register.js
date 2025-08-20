// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // assure-toi que auth est exporté

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // inscription réussie → redirige vers la page de connexion
      navigate("/login");
    } catch (err) {
      setError(err.message);
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
        onSubmit={handleRegister}
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#1f1f1f",
          padding: 30,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>S’inscrire</h2>

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

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Inscription..." : "S’inscrire"}
        </button>

        <p style={{ textAlign: "center", marginTop: 15 }}>
          Déjà inscrit ?{" "}
          <Link
                      to="/login"
                      style={{ color: "#ff3d00", fontWeight: "bold", textDecoration: "none" }}
                    >
                      Se connecter
                    </Link>
            
          
        </p>
      </form>
    </div>
  );
}
