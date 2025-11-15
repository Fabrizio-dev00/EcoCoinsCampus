import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../css/modules/components.css";

const testimonials = [
  {
    id: 1,
    text: "EcoCoinsCampus me motivó a reciclar por primera vez. No solo ayudo al planeta, también gano premios que puedo usar en la cafetería. Es divertido y útil.",
    author: "Lucía Fernández",
    role: "Ingeniería Ambiental",
    initials: "L",
    color: "#10b981"
  },
  {
    id: 2,
    text: "¡Ya gané 50 EcoCoins reciclando! Es súper fácil y divertido. Me encanta competir con mi facultad para ver quién recicla más.",
    author: "María González",
    role: "Ingeniería Industrial",
    initials: "M",
    color: "#3b82f6"
  },
  {
    id: 3,
    text: "El sistema es increíble, he canjeado por descuentos en la cafetería y papelería. Además, veo el impacto positivo que generamos en el campus.",
    author: "Carlos Mendoza",
    role: "Administración",
    initials: "C",
    color: "#8b5cf6"
  },
  {
    id: 4,
    text: "EcoCoins me motivó a ser más sostenible. ¡Cambié mis hábitos! Ahora siempre busco los puntos de reciclaje en el campus.",
    author: "Ana Rodríguez",
    role: "Ciencias",
    initials: "A",
    color: "#f59e0b"
  }
];

export default function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section id="testimonio" className="testimonial-section">
      <div className="testimonial-container">
        <motion.div 
          className="testimonial-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Lo que dicen los estudiantes</h2>
        </motion.div>

        <div className="testimonial-carousel">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="testimonial-card"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="quote-icon">
                <span style={{ color: testimonials[currentIndex].color }}>"</span>
              </div>
              
              <div className="testimonial-content">
                <div 
                  className="author-avatar" 
                  style={{ backgroundColor: testimonials[currentIndex].color }}
                >
                  {testimonials[currentIndex].initials}
                </div>
                
                <blockquote className="testimonial-text">
                  "{testimonials[currentIndex].text}"
                </blockquote>
                
                <div className="author-info">
                  <div className="author-name">{testimonials[currentIndex].author}</div>
                  <div className="author-role">{testimonials[currentIndex].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="testimonial-navigation">
            <button className="nav-arrow nav-prev" onClick={prevTestimonial}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </button>
            
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`testimonial-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToTestimonial(index)}
                />
              ))}
            </div>
            
            <button className="nav-arrow nav-next" onClick={nextTestimonial}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
