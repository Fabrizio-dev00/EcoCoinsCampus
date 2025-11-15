import React from "react";
import "./Sidebar.css";

export default function Sidebar({ activeSection, onSelect }) {
  const menu = [
    { key: "usuarios", label: "👥 Usuarios" },
    { key: "reciclajes", label: "♻️ Reciclajes" },
    { key: "recompensas", label: "🎁 Recompensas" },
    { key: "estadisticas", label: "📊 Estadísticas" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">🌍</span>
        <h2>EcoCoins</h2>
      </div>

      <nav>
        {menu.map((item) => (
          <button
            key={item.key}
            className={`menu-btn ${activeSection === item.key ? "active" : ""}`}
            onClick={() => onSelect(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">🚪 Cerrar sesión</button>
      </div>
    </aside>
  );
}
