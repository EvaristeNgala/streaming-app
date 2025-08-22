// src/components/AdBanner.js
import React, { useEffect } from "react";

const AdBanner = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "//pl27481644.profitableratecpm.com/cbf1e75f4094c3e9d246f6ec35a8072c/invoke.js";

    const container = document.getElementById("container-cbf1e75f4094c3e9d246f6ec35a8072c");
    if (container) {
      container.appendChild(script);
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "100px", margin: "10px 0", textAlign: "center" }}>
      <div id="container-cbf1e75f4094c3e9d246f6ec35a8072c" style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default AdBanner;
