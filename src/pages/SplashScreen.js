// src/pages/SplashScreen.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./lvblas.png"; // ⚡ ici on importe le logo depuis le même dossier

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home"); // redirection après 3 sec
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#000",
      }}
    >
      {/* Logo dans un cercle */}
      <img
        src={Logo} // ⚡ utilisation de l'import
        alt="Logo"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%", // cercle
          animation: "pulse 2s infinite",
        }}
      />
    </div>
  );
}

export default SplashScreen;
