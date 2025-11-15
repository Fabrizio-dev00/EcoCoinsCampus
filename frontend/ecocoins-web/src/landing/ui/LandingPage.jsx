import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import MissionVision from "./components/MissionVision";
import Testimonial from "./components/Testimonial";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import "../css/index.css"; // importa todo el CSS de landing

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <MissionVision />
        <Testimonial />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
