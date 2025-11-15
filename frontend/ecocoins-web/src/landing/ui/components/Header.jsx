import React from "react";
import { Link } from "react-router-dom";
import "../../css/modules/components.css";
import logoImage from "../../../images/hero/logo.png";

const scrollToSection = (sectionId) => {
  if (window.location.pathname !== '/') {
    window.location.href = `/#${sectionId}`;
    return;
  }
  
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};

export default function Header() {
  return (
    <header className="lc-header">
      <div className="lc-header-inner">
        <Link to="/" className="logo">
          <img src={logoImage} alt="EcoCoinsCampus Logo" className="logo-image" />
          <span className="logo-text">EcoCoinsCampus</span>
        </Link>
        <nav className="nav">
          <button 
            onClick={() => scrollToSection('how')} 
            className="nav-link"
          >
            Cómo funciona
          </button>
          <button 
            onClick={() => scrollToSection('compromiso')} 
            className="nav-link"
          >
            Nuestro compromiso
          </button>
          <button 
            onClick={() => scrollToSection('testimonio')} 
            className="nav-link"
          >
            Testimonio
          </button>
          <Link to="/recompensas" className="btn-admin">Recompensas</Link>
        </nav>
      </div>
    </header>
  );
}
