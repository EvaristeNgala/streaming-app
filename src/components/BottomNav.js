import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiFillHome } from "react-icons/ai"; // Accueil
import { FaFilm } from "react-icons/fa";     // Films
import { MdTv } from "react-icons/md";       // Séries
import { BiUser } from "react-icons/bi";     // Se connecter

function BottomNav() {
  const location = useLocation();

  const navItems = [
    { name: "Accueil", path: "/", icon: <AiFillHome size={24} /> },
    { name: "Films", path: "/films", icon: <FaFilm size={24} /> },
    { name: "Séries", path: "/series", icon: <MdTv size={24} /> },
    { name: "Se connecter", path: "/login", icon: <BiUser size={24} /> }
  ];

  return (
    <div style={styles.nav}>
      {navItems.map((item) => (
        <Link 
          key={item.name} 
          to={item.path} 
          style={{
            ...styles.link, 
            color: location.pathname === item.path ? "#ff0000" : "#fff"
          }}
        >
          {item.icon}
          <div style={{ fontSize: "12px", marginTop: "2px" }}>{item.name}</div>
        </Link>
      ))}
    </div>
  );
}

const styles = {
  nav: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    backgroundColor: "#121212",
    display: "flex",
    justifyContent: "space-around",
    padding: "8px 0",
    zIndex: 1000,
    boxShadow: "0 -2px 5px rgba(0,0,0,0.5)"
  },
  link: {
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default BottomNav;
