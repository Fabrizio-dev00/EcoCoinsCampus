import React from "react";
import { motion } from "framer-motion";
import "../../css/modules/components.css";

const steps = [
  {
    number: "01",
    title: "Recicla Materiales",
    text: "Los estudiantes depositan materiales reciclables en los puntos habilitados en el campus.",
    color: "#10b981",
    icon: "♻️"
  },
  {
    number: "02", 
    title: "Gana EcoCoins",
    text: "Cada acción de reciclaje se convierte automáticamente en EcoCoins basado en el tipo y cantidad de material.",
    color: "#3b82f6",
    icon: "🪙"
  },
  {
    number: "03",
    title: "Canjea Recompensas", 
    text: "Usa tus EcoCoins para obtener descuentos en la cafetería, papelería, o donaciones a causas ambientales.",
    color: "#8b5cf6",
    icon: "🎁"
  },
  {
    number: "04",
    title: "Compite y Mejora",
    text: "Participa en rankings mensuales entre facultades y ve el impacto ambiental positivo de tu institución.",
    color: "#f59e0b",
    icon: "🏆"
  }
];

export default function HowItWorks() {
  return (
    <section id="how" className="how-it-works-section">
      <div className="how-container">
        <div className="how-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            ¿Cómo funciona <span className="highlight">EcoCoins</span>?
          </motion.h2>
          
          <motion.p
            className="how-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Un sistema intuitivo que transforma hábitos sostenibles en beneficios tangibles para estudiantes e instituciones educativas.
          </motion.p>
        </div>

        <div className="how-steps">
          {steps.map((step, i) => (
            <motion.div
              className="how-step"
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1 * i, duration: 0.7 }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
            >
              <div className="step-number" style={{ backgroundColor: step.color }}>
                {step.number}
              </div>
              
              <div className="step-icon" style={{ backgroundColor: step.color + '20' }}>
                <span className="icon-emoji">{step.icon}</span>
              </div>
              
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.text}</p>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
