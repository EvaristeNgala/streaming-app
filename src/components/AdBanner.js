import React, { useEffect } from "react";

const AdBanner = ({ containerId }) => {
  useEffect(() => {
    // Créer le script seulement si le container existe
    const container = document.getElementById(containerId);
    if (container && !container.hasChildNodes()) {
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = "//pl27481644.profitableratecpm.com/cbf1e75f4094c3e9d246f6ec35a8072c/invoke.js";
      container.appendChild(script);
    }
  }, [containerId]);

  return (
    <div
      style={{
        width: "100%",
        height: "100px",      // hauteur fixe
        maxHeight: "100px",   // empêcher dépassement
        overflow: "hidden",   // cache le contenu qui dépasse
        margin: "10px 0",
        textAlign: "center",
      }}
    >
      <div
        id={containerId}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      ></div>
    </div>
  );
};

export default AdBanner;
