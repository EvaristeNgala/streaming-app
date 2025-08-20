// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Tes composants existants
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Films from "./pages/Films";
import Series from "./pages/Series";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Detail from "./pages/Detail";
import SplashScreen from "./pages/SplashScreen"; // ✅ nouveau import

function App() {
  return (
    <Router>
      {/* paddingBottom pour que le footer ne cache pas le contenu */}
      <div style={{ paddingBottom: "60px" }}>
        <Routes>
          {/* SplashScreen au démarrage */}
          <Route path="/" element={<SplashScreen />} />

          {/* Après redirection → Home */}
          <Route path="/home" element={<Home />} />
          <Route path="/films" element={<Films />} />
          <Route path="/series" element={<Series />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/detail/:type/:id" element={<Detail />} />
        </Routes>
      </div>

      {/* Footer mobile */}
      <BottomNav />
    </Router>
  );
}

export default App;
