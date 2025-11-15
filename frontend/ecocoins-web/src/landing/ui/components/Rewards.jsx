import React from "react";
import { motion } from "framer-motion";
import "../../css/modules/components.css";
import logoImage from "../../../images/hero/logo.png";
import tecImage from "../../../images/hero/tec.jpg";
import salidaImage from "../../../images/hero/salida.png";
import notaImage from "../../../images/hero/nota.png";
import canchaImage from "../../../images/hero/cancha.png";
import salaImage from "../../../images/hero/sala.png";
import libroImage from "../../../images/hero/libro.png";

const rewardsData = [
  {
    id: 1,
    title: "Justificante de Asistencia",
    description: "Justifica 1 falta sin necesidad de presentarte a clase",
    cost: 350,
    image: tecImage
  },
  {
    id: 2,
    title: "Salida Anticipada",
    description: "Sal 15 minutos antes en todas tus clases durante una semana",
    cost: 200,
    image: salidaImage
  },
  {
    id: 3,
    title: "Eliminar Nota de Teoría",
    description: "Elimina tu peor calificación de un examen teórico del semestre",
    cost: 500,
    image: notaImage
  },
  {
    id: 4,
    title: "Sala Privada de Estudio",
    description: "Acceso exclusivo a salas privadas de la biblioteca por 1 mes",
    cost: 300,
    image: salaImage
  },
  {
    id: 5,
    title: "Préstamo Extendido",
    description: "Extiende el plazo de préstamo de libros de 7 a 30 días",
    cost: 150,
    image: libroImage
  },
  {
    id: 6,
    title: "Reserva Polideportivo",
    description: "Reservar el polideportivo por 1 hora desde la app",
    cost: 180,
    image: canchaImage
  }
];

export default function Rewards() {

  return (
    <div className="rewards-page">
      <section className="rewards-header-section">
        <div className="rewards-header-container">
          <h1>Beneficios académicos por <span className="highlight">reciclar</span></h1>
          <p>Accede a recompensas exclusivas que mejoran tu experiencia universitaria. Descarga la app móvil para canjear tus beneficios.</p>
        </div>
      </section>

      <section className="rewards-grid-section">
        <div className="rewards-grid-container">
          <p className="app-note">Descarga la app móvil para canjear tus beneficios</p>
          
          <div className="rewards-grid">
            {rewardsData.map((reward) => (
              <motion.div
                key={reward.id}
                className="reward-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
              >
                <div className="reward-image">
                  <img src={reward.image} alt={reward.title} />
                </div>
                
                <div className="reward-content">
                  <h3 className="reward-title">{reward.title}</h3>
                  <p className="reward-description">{reward.description}</p>
                  
                  <div className="reward-details">
                    <div className="reward-cost">
                      <img src={logoImage} alt="EcoCoinsCampus" className="eco-logo" />
                      <span className="cost-amount">{reward.cost}</span>
                      <span className="eco-coins-text">EcoCoins</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="download-app-section">
        <div className="download-app-container">
          <h2>Descarga la app para canjear tus recompensas</h2>
          <p>Estas recompensas se canjean exclusivamente desde la app de EcoCoinsCampus. Instálala gratis y empieza a disfrutar de tus beneficios.</p>
        </div>
      </section>
    </div>
  );
}