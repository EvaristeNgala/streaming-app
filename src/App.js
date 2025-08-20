// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Assure-toi que les fichiers exportent par défaut le composant
import BottomNav from "./components/BottomNav"; 
import Home from "./pages/Home";
import Films from "./pages/Films";
import Series from "./pages/Series";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Detail from "./pages/Detail";

function App() {
  return (
    <Router>
      {/* paddingBottom pour que le footer ne cache pas le contenu */}
      <div style={{ paddingBottom: "60px" }}> 
        <Routes>
          <Route path="/" element={<Home />} />
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
