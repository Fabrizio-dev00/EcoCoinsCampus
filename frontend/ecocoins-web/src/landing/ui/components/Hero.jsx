import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../../css/modules/components.css";

import tecsupImage from "../../../images/hero/tec.jpg";
import tecsupCampusImage from "../../../images/hero/tecsup-campus.png";
import campusTecImage from "../../../images/hero/campus_tec.png";

const title = "Gana recompensas reales por cuidar tu campus";
const subtitle = "Recicla, acumula EcoCoins y canjea por premios: gamificación simple y justa.";


const images = [
  {
    src: tecsupImage,
    alt: "Campus Tecsup"
  },
  {
    src: tecsupCampusImage,
    alt: "Campus Tecsup"
  },
  {
    src: campusTecImage,
    alt: "Campus Tecsup"
  }
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="lc-hero" aria-label="Hero">
      {/* Imágenes de fondo con transición */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`hero-bg-image ${index === currentImageIndex ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${image.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />
      ))}
      
      <div className="hero-overlay"></div>
      
      <motion.div
        className="lc-hero-inner"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <h1 className="lc-hero-title">{title}</h1>
          <p className="lc-hero-sub">{subtitle}</p>

          <div className="lc-hero-ctas">
            <a className="btn-primary" href="#how">¡Únete y Gana tu 1er EcoCoin!</a>
          </div>
        </div>
      </motion.div>

      <div className="hero-carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}
