import React from "react";
import { motion } from "framer-motion";
import "../../css/modules/components.css";

const benefits = [
  {
    icon: "🎓",
    title: "Educación Ambiental",
    description: "Fomenta la conciencia ecológica entre estudiantes y personal académico a través de la gamificación.",
    color: "#3b82f6"
  },
  {
    icon: "🌱",
    title: "Impacto Sostenible", 
    description: "Reduce significativamente la huella de carbono de la institución con acciones medibles y concretas.",
    color: "#10b981"
  },
  {
    icon: "📈",
    title: "Ahorro Económico",
    description: "Disminuye los costos de gestión de residuos y genera ingresos adicionales por materiales reciclados.",
    color: "#ec4899"
  },
  {
    icon: "👥",
    title: "Comunidad Activa",
    description: "Fortalece el sentido de pertenencia y trabajo en equipo hacia objetivos ambientales comunes.",
    color: "#f59e0b"
  },
  {
    icon: "🏆",
    title: "Certificaciones Verdes",
    description: "Facilita la obtención de reconocimientos y certificaciones ambientales para la institución.",
    color: "#6366f1"
  },
  {
    icon: "🌍",
    title: "Responsabilidad Social",
    description: "Posiciona a la institución como líder en responsabilidad social y sostenibilidad ambiental.",
    color: "#14b8a6"
  }
];

export default function MissionVision() {
  return (
    <section id="compromiso" className="commitment-section">
      <div className="commitment-container">
        <div className="commitment-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Transforma tu institución en un <span className="highlight">referente de sostenibilidad</span>
          </motion.h2>
          
          <motion.p
            className="commitment-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            EcoCoins no solo beneficia el medio ambiente, sino que también fortalece la imagen institucional y crea una cultura de responsabilidad ambiental que perdura en el tiempo.
          </motion.p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, i) => (
            <motion.div
              className="benefit-card"
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                delay: 0.1 * i, 
                duration: 0.7,
                type: "spring",
                stiffness: 100
              }}
            >
              <motion.div 
                className="benefit-icon" 
                style={{ backgroundColor: benefit.color }}
              >
                <motion.span>
                  {benefit.icon}
                </motion.span>
              </motion.div>
              <div className="benefit-content">
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
