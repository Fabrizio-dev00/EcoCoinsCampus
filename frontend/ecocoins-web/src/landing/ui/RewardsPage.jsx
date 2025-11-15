import React from "react";
import Header from "./components/Header";
import Rewards from "./components/Rewards";
import Footer from "./components/Footer";
import "../css/index.css"; // importa todo el CSS de landing

export default function RewardsPage() {
  return (
    <>
      <Header />
      <main>
        <Rewards />
      </main>
      <Footer />
    </>
  );
}

