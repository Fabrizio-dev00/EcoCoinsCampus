import React from "react";
import "./Sidebar.css";

export default function Sidebar({ activeSection, onSelect, estadisticas }) {
  // Menú principal con TODOS los items
  const menu = [
    { 
      key: "estadisticas", 
      label: "Estadísticas",
      icon: "📊"
    },
    { 
      key: "usuarios", 
      label: "Usuarios",
      icon: "👥"
    },
    { 
      key: "reciclajes", 
      label: "Reciclajes",
      icon: "♻️"
    },
    { 
      key: "recompensas", 
      label: "Recompensas",
      icon: "🎁"
    },
    { key: "transacciones", 
      label: "Transacciones", 
      icon: "💳" 
    },
    { key: "notificaciones", 
      label: "Notificaciones", 
      icon: "🔔" 
    }
  ];

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de cerrar sesión?")) {
      localStorage.clear();
      window.location.href = "/admin";
    }
  };

  const adminNombre = localStorage.getItem("adminNombre") || "Administrador";
  const adminCorreo = localStorage.getItem("adminCorreo") || "";

  // Datos del resumen (con fallback)
  const usuarios = estadisticas?.total_usuarios || 10;
  const reciclajes = estadisticas?.total_reciclajes || 1;
  const ecoCoins = estadisticas?.total_ecoCoins_generadas || 0;

  return (
    <aside className="sidebar-lovable">
      {/* ============================================
          📌 HEADER - Logo y Título
          ============================================ */}
      <div className="sidebar-header-lovable">
        <div className="logo-container">
          <div className="logo-icon">🌱</div>
          <div className="logo-text">
            <h2>EcoCoins</h2>
            <p>Campus Admin</p>
          </div>
        </div>
      </div>

      {/* ============================================
          🏷️ TÍTULO DEL MENÚ
          ============================================ */}
      <div className="menu-title">
        <span>PANEL DE CONTROL</span>
      </div>

      {/* ============================================
          🧭 NAVEGACIÓN PRINCIPAL
          ============================================ */}
      <nav className="sidebar-nav-lovable">
        {menu.map((item) => (
          <button
            key={item.key}
            className={`menu-item ${activeSection === item.key ? "active" : ""}`}
            onClick={() => onSelect(item.key)}
            title={item.label}
          >
            <span className="menu-item-icon">{item.icon}</span>
            <span className="menu-item-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* ============================================
          📊 RESUMEN RÁPIDO
          ============================================ */}
      <div className="sidebar-stats">
        <p className="stats-title">📈 RESUMEN</p>
        
        <div className="stat-item-sidebar">
          <span className="stat-icon-sidebar">👥</span>
          <div className="stat-content-sidebar">
            <p className="stat-label-sidebar">Usuarios</p>
            <p className="stat-value-sidebar">{usuarios}</p>
          </div>
        </div>

        <div className="stat-item-sidebar">
          <span className="stat-icon-sidebar">♻️</span>
          <div className="stat-content-sidebar">
            <p className="stat-label-sidebar">Reciclajes</p>
            <p className="stat-value-sidebar">{reciclajes}</p>
          </div>
        </div>

        <div className="stat-item-sidebar highlight">
          <span className="stat-icon-sidebar">🌿</span>
          <div className="stat-content-sidebar">
            <p className="stat-label-sidebar">EcoCoins</p>
            <p className="stat-value-sidebar">{ecoCoins}</p>
          </div>
        </div>
      </div>

      {/* ============================================
          👤 FOOTER - Info Admin y Logout
          ============================================ */}
      <div className="sidebar-footer-lovable">
        {/* Info del Admin */}
        <div className="admin-info">
          <div className="admin-avatar">
            {adminNombre.charAt(0).toUpperCase()}
          </div>
          <div className="admin-details">
            <p className="admin-name">{adminNombre}</p>
            <p className="admin-role">Administrador</p>
            {adminCorreo && (
              <p className="admin-email">{adminCorreo}</p>
            )}
          </div>
        </div>
        
        {/* Botón Cerrar Sesión */}
        <button className="logout-button" onClick={handleLogout}>
          <span>🚪</span>
          <span>Cerrar sesión</span>
        </button>

        {/* Versión y Copyright */}
        <div className="footer-info-lovable">
          <p className="app-version">v1.0.0</p>
          <p className="copyright">© 2024 EcoCoins</p>
        </div>
      </div>
    </aside>
  );
}