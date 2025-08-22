// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BottomNav from "./components/BottomNav"; 
import Home from "./pages/Home";
import Films from "./pages/Films";
import Series from "./pages/Series";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Detail from "./pages/Detail";
import AdBanner from "./components/AdBanner";

function App() {
  // Charger le script pub globalement (une seule fois)
  useEffect(() => {
    if (!document.getElementById("profitableratecpm-script")) {
      const script = document.createElement("script");
      script.id = "profitableratecpm-script";
      script.src = "//pl27464220.profitableratecpm.com/3a/31/ce/3a31ce3c4a07f92315a0d88f6ffe3c2a.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <Router>
      <div style={{ paddingBottom: "60px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/films" element={<Films />} />
          <Route path="/series" element={<Series />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/detail/:type/:id" element={<Detail />} /> 
        </Routes>
        <AdBanner />
      </div>
      <BottomNav />
    </Router>
  );
}

export default App;
