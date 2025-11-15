import React from "react";
import "../../css/modules/components.css";

export default function Footer() {
  return (
    <footer className="lc-footer">
      <div className="lc-footer-inner">
        <div>© {new Date().getFullYear()} EcoCoinsCampus — Proyecto Sostenible TECSUP</div>
        <div className="footer-links">
          <a href="/recompensas">Recompensas</a>
          <a href="#how">Cómo funciona</a>
          <a href="#compromiso">Compromiso</a>
        </div>
      </div>
    </footer>
  );
}
