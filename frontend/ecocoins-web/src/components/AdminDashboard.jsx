import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import UsuariosTable from "./UsuariosTable";
import Sidebar from "./Sidebar";
import EstadisticasPanel from "./EstadisticasPanel";
import TransaccionesPanel from "./TransaccionesPanel";
import NotificacionesPanel from "./NotificacionesPanel";

export default function AdminDashboard() {
  const [section, setSection] = useState("estadisticas");
  const [reciclajes, setReciclajes] = useState([]);
  const [recompensas, setRecompensas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_PANEL = "http://localhost:8000/api/panel";

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchReciclajes(),
        fetchRecompensas(),
        fetchEstadisticas(),
      ]);
    } catch (err) {
      console.error("❌ Error al cargar datos:", err);
      setError("Error al cargar los datos del servidor");
    } finally {
      setLoading(false);
    }
  };

  const fetchReciclajes = async () => {
    try {
      const res = await fetch(`${API_PANEL}/reciclajes/`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      console.log("✅ Reciclajes cargados:", data.length);
      setReciclajes(data);
    } catch (err) {
      console.error("❌ Error:", err);
      setReciclajes([]);
    }
  };

  const fetchRecompensas = async () => {
    try {
      const res = await fetch(`${API_PANEL}/recompensas/`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      console.log("✅ Recompensas cargadas:", data.length);
      setRecompensas(data);
    } catch (err) {
      console.error("❌ Error:", err);
      setRecompensas([]);
    }
  };

  const fetchEstadisticas = async () => {
    try {
      const res = await fetch(`${API_PANEL}/estadisticas/`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      console.log("✅ Estadísticas cargadas:", data);
      setEstadisticas(data);
    } catch (err) {
      console.error("❌ Error:", err);
      setEstadisticas({});
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const renderSection = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando datos del servidor...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error al cargar datos</h3>
          <p>{error}</p>
          <button onClick={loadAllData} className="btn-retry">
            🔄 Reintentar
          </button>
        </div>
      );
    }

    switch (section) {
      case "estadisticas":
        return (
          <section className="card stats-card">
            <h2>📊 Estadísticas Generales</h2>
            <EstadisticasPanel 
              estadisticas={estadisticas} 
              onRefresh={fetchEstadisticas}
            />
          </section>
        );

      case "usuarios":
        return (
          <section className="card">
            <h2>👥 Gestión de Usuarios</h2>
            <UsuariosTable />
          </section>
        );

      case "reciclajes":
        return (
          <section className="card">
            <div className="card-header">
              <h2>♻️ Historial de Reciclajes</h2>
              <button onClick={fetchReciclajes} className="btn-refresh">
                🔄 Actualizar
              </button>
            </div>

            {reciclajes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No hay reciclajes registrados</h3>
                <p>Los reciclajes aparecerán aquí cuando los usuarios depositen materiales.</p>
              </div>
            ) : (
              <>
                <div className="stats-summary">
                  <div className="stat-box">
                    <span className="stat-label">Total Reciclajes</span>
                    <span className="stat-value">{reciclajes.length}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">EcoCoins Generadas</span>
                    <span className="stat-value">
                      {reciclajes.reduce((sum, r) => 
                        sum + (r.ecocoins_generadas || r.ecoCoins_ganadas || 0), 0
                      )}
                    </span>
                  </div>
                </div>

                <div className="list">
                  {reciclajes.slice(0, 20).map((r, i) => (
                    <div className="list-item" key={r._id || i}>
                      <div className="li-left">
                        <div className="li-title">
                          {r.tipo_material || r.tipo || "Material Reciclado"}
                        </div>
                        <div className="li-sub">
                          <span className="badge">Usuario: {r.usuario_id || "Desconocido"}</span>
                          {r.punto_recoleccion && (
                            <span className="badge badge-secondary">
                              📍 {r.punto_recoleccion}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="li-right">
                        <div className="li-coins">
                          +{r.ecocoins_generadas || r.ecoCoins_ganadas || 0} ♻️
                        </div>
                        {r.cantidad && (
                          <div className="li-quantity">{r.cantidad} kg</div>
                        )}
                        <div className="li-date muted">
                          {formatDate(r.fecha)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {reciclajes.length > 20 && (
                  <div className="pagination-info">
                    Mostrando 20 de {reciclajes.length} registros
                  </div>
                )}
              </>
            )}
          </section>
        );

      case "recompensas":
        return (
          <section className="card">
            <div className="card-header">
              <h2>🎁 Catálogo de Recompensas</h2>
              <button onClick={fetchRecompensas} className="btn-refresh">
                🔄 Actualizar
              </button>
            </div>

            {recompensas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎁</div>
                <h3>No hay recompensas disponibles</h3>
                <p>Las recompensas que agregues aparecerán aquí.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>🎁 Nombre</th>
                      <th>📝 Descripción</th>
                      <th>💰 Costo (EcoCoins)</th>
                      <th>📦 Stock</th>
                      <th>🔧 Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recompensas.map((r, i) => (
                      <tr key={r._id || i}>
                        <td>
                          <strong>{r.nombre || "Sin nombre"}</strong>
                        </td>
                        <td className="description-cell">
                          {r.descripcion || "Sin descripción"}
                        </td>
                        <td>
                          <span className="badge badge-coins">
                            {r.costoEcoCoins || r.costo_ecocoins || 0} ♻️
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${r.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                            {r.stock || 0}
                          </span>
                        </td>
                        <td>
                          {r.stock > 0 ? (
                            <span className="status-available">✅ Disponible</span>
                          ) : (
                            <span className="status-unavailable">❌ Agotado</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );

      // ============================================
      // 💳 TRANSACCIONES (AGREGADO)
      // ============================================
      case "transacciones":
        return (
          <section className="card">
            <TransaccionesPanel />
          </section>
        );

      // ============================================
      // 🔔 NOTIFICACIONES (AGREGADO)
      // ============================================
      case "notificaciones":
        return (
          <section className="card">
            <NotificacionesPanel />
          </section>
        );

      default:
        return (
          <div className="placeholder">
            <h3>Selecciona una sección del menú</h3>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar 
        activeSection={section} 
        onSelect={setSection}
        estadisticas={estadisticas}
      />
      
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <h1>🌱 EcoCoins Campus</h1>
              <p className="header-subtitle">Panel Administrativo</p>
            </div>
            <div className="header-right">
              <button 
                onClick={loadAllData} 
                className="btn-refresh-all"
                disabled={loading}
              >
                {loading ? "⏳ Cargando..." : "🔄 Actualizar Todo"}
              </button>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}