import React, { useEffect, useState } from "react";
import "./TransaccionesPanel.css";

export default function TransaccionesPanel() {
  const [transacciones, setTransacciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total_generado_hoy: 0,
    total_canjeado_hoy: 0,
    balance_neto_hoy: 0,
    transacciones_hoy: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("todos");

  const API_BASE = "http://localhost:8000/api/panel";

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Cargar transacciones
      const resTransacciones = await fetch(`${API_BASE}/transacciones/`);
      
      if (!resTransacciones.ok) {
        throw new Error(`Error ${resTransacciones.status}: ${resTransacciones.statusText}`);
      }
      
      const dataTransacciones = await resTransacciones.json();
      
      // ✅ VALIDACIÓN: Asegurarse de que sea un array
      if (Array.isArray(dataTransacciones)) {
        setTransacciones(dataTransacciones);
        console.log("✅ Transacciones cargadas:", dataTransacciones.length);
      } else {
        console.error("❌ La respuesta no es un array:", dataTransacciones);
        setTransacciones([]);
        setError("La respuesta del servidor no es válida");
      }

      // Cargar estadísticas
      try {
        const resEstadisticas = await fetch(`${API_BASE}/transacciones/estadisticas/`);
        if (resEstadisticas.ok) {
          const dataEstadisticas = await resEstadisticas.json();
          setEstadisticas(dataEstadisticas);
        }
      } catch (err) {
        console.warn("⚠️ No se pudieron cargar estadísticas:", err);
      }
      
    } catch (error) {
      console.error("❌ Error al cargar transacciones:", error);
      setError(error.message || "Error de conexión con el servidor");
      setTransacciones([]);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return fecha;
    }
  };

  // ✅ FILTRADO SEGURO
  const transaccionesFiltradas = Array.isArray(transacciones) 
    ? transacciones.filter(t => {
        if (filtro === "ganados") return t.tipo === "Ganado";
        if (filtro === "canjeados") return t.tipo === "Canjeado";
        return true;
      })
    : [];

  const conteoGanados = Array.isArray(transacciones) 
    ? transacciones.filter(t => t.tipo === "Ganado").length 
    : 0;
    
  const conteoCanjeados = Array.isArray(transacciones) 
    ? transacciones.filter(t => t.tipo === "Canjeado").length 
    : 0;

  // ============================================
  // LOADING
  // ============================================
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando transacciones...</p>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================
  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error al cargar transacciones</h3>
        <p>{error}</p>
        <button onClick={cargarDatos} className="btn-retry">
          🔄 Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="transacciones-panel">
      {/* Header */}
      <div className="panel-header">
        <div>
          <h1>💳 Transacciones</h1>
          <p className="header-subtitle">Historial completo de EcoCoins</p>
        </div>
        <button onClick={cargarDatos} className="btn-refresh">
          🔄 Actualizar
        </button>
      </div>

      {/* Tarjetas de resumen */}
      <div className="stats-cards-grid">
        <div className="stat-card green">
          <div className="stat-icon">📈</div>
          <div>
            <p className="stat-label">Total Generado</p>
            <h3 className="stat-value">+{estadisticas.total_generado_hoy}</h3>
            <p className="stat-sublabel">EcoCoins hoy</p>
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-icon">📉</div>
          <div>
            <p className="stat-label">Total Canjeado</p>
            <h3 className="stat-value">-{estadisticas.total_canjeado_hoy}</h3>
            <p className="stat-sublabel">EcoCoins hoy</p>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">💰</div>
          <div>
            <p className="stat-label">Balance Neto</p>
            <h3 className="stat-value">
              {estadisticas.balance_neto_hoy >= 0 ? "+" : ""}
              {estadisticas.balance_neto_hoy}
            </h3>
            <p className="stat-sublabel">EcoCoins hoy</p>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">📊</div>
          <div>
            <p className="stat-label">Transacciones</p>
            <h3 className="stat-value">{estadisticas.transacciones_hoy}</h3>
            <p className="stat-sublabel">hoy</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-container">
        <button
          className={`filtro-btn ${filtro === "todos" ? "active" : ""}`}
          onClick={() => setFiltro("todos")}
        >
          Todos ({transacciones.length})
        </button>
        <button
          className={`filtro-btn ${filtro === "ganados" ? "active" : ""}`}
          onClick={() => setFiltro("ganados")}
        >
          ✅ Ganados ({conteoGanados})
        </button>
        <button
          className={`filtro-btn ${filtro === "canjeados" ? "active" : ""}`}
          onClick={() => setFiltro("canjeados")}
        >
          ❌ Canjeados ({conteoCanjeados})
        </button>
      </div>

      {/* Tabla de transacciones */}
      <div className="table-card">
        <h3>📋 Historial de Transacciones</h3>
        
        {transaccionesFiltradas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No hay transacciones para mostrar</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="transacciones-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Descripción</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {transaccionesFiltradas.slice(0, 50).map((trans, index) => (
                  <tr key={trans._id || index}>
                    <td className="td-id">
                      {trans._id ? trans._id.substring(0, 8) + "..." : "N/A"}
                    </td>
                    <td>
                      <div className="usuario-cell">
                        <strong>{trans.usuario_nombre || "Usuario desconocido"}</strong>
                        <span className="usuario-email">
                          {trans.usuario_correo || ""}
                        </span>
                      </div>
                    </td>
                    <td>{trans.descripcion || "Sin descripción"}</td>
                    <td>
                      <span className={`badge ${trans.tipo === "Ganado" ? "badge-success" : "badge-danger"}`}>
                        {trans.tipo || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className={`cantidad ${trans.cantidad > 0 ? "positivo" : "negativo"}`}>
                        {trans.cantidad > 0 ? "+" : ""}{trans.cantidad || 0} ♻️
                      </span>
                    </td>
                    <td className="td-fecha">{formatearFecha(trans.fecha)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}