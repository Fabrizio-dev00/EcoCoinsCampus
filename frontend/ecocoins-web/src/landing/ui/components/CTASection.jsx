import React from "react";
import { motion } from "framer-motion";
import "../../css/modules/components.css";

export default function CTASection() {
  return (
    <section className="lc-section cta-section">
      <motion.div initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
        <h2>Empieza hoy y sé parte del cambio verde</h2>
        <p className="lead">No esperes más para convertir tus acciones sostenibles en recompensas reales.</p>
        <a className="btn-primary" href="#how">¡Únete y Gana tu 1er EcoCoin!</a>
      </motion.div>
    </section>
  );
}
