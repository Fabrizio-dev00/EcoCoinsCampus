import React, { useEffect, useState } from "react";
import "./NotificacionesPanel.css";

export default function NotificacionesPanel() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total_enviadas_mes: 0,
    tasa_apertura_promedio: 0
  });
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [enviando, setEnviando] = useState(false);
  
  // Formulario
  const [formData, setFormData] = useState({
    titulo: "",
    mensaje: "",
    destinatarios: "todos"
  });

  const API_BASE = "http://localhost:8000/api/panel/notificaciones";

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar notificaciones
      const resNotificaciones = await fetch(`${API_BASE}/`);
      const dataNotificaciones = await resNotificaciones.json();
      setNotificaciones(dataNotificaciones);

      // Cargar estadísticas
      const resEstadisticas = await fetch(`${API_BASE}/estadisticas/`);
      const dataEstadisticas = await resEstadisticas.json();
      setEstadisticas(dataEstadisticas);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.mensaje) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (!window.confirm(`¿Enviar notificación a: ${formData.destinatarios}?`)) {
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch(`${API_BASE}/crear/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Notificación enviada exitosamente");
        setFormData({ titulo: "", mensaje: "", destinatarios: "todos" });
        setMostrarFormulario(false);
        cargarDatos();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al enviar notificación:", error);
      alert("❌ Error de conexión");
    } finally {
      setEnviando(false);
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

  // Plantillas rápidas
  const plantillas = [
    {
      nombre: "🎉 Felicitación por nivel",
      titulo: "¡Felicitaciones!",
      mensaje: "¡Has alcanzado el nivel Oro! Sigue reciclando."
    },
    {
      nombre: "🎁 Nueva recompensa",
      titulo: "Nueva Recompensa Disponible",
      mensaje: "¡Ya puedes canjear la Botella Reutilizable Premium!"
    },
    {
      nombre: "📊 Resumen semanal",
      titulo: "Resumen Semanal",
      mensaje: "Esta semana reciclaste 15kg de materiales. ¡Excelente trabajo!"
    },
    {
      nombre: "⚡ Evento especial",
      titulo: "Evento Especial",
      mensaje: "Este fin de semana: ¡Doble de EcoCoins por cada reciclaje!"
    }
  ];

  const aplicarPlantilla = (plantilla) => {
    setFormData({
      ...formData,
      titulo: plantilla.titulo,
      mensaje: plantilla.mensaje
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando notificaciones...</p>
      </div>
    );
  }

  return (
    <div className="notificaciones-panel">
      {/* Header */}
      <div className="panel-header">
        <div>
          <h1>🔔 Notificaciones</h1>
          <p className="header-subtitle">Envía notificaciones a los usuarios</p>
        </div>
        <div className="header-actions">
          <button onClick={cargarDatos} className="btn-refresh">
            🔄 Actualizar
          </button>
          <button 
            onClick={() => setMostrarFormulario(!mostrarFormulario)} 
            className="btn-primary"
          >
            {mostrarFormulario ? "❌ Cancelar" : "➕ Nueva Notificación"}
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="stats-cards-grid">
        <div className="stat-card blue">
          <div className="stat-icon">📧</div>
          <div>
            <p className="stat-label">Total Enviadas</p>
            <h3 className="stat-value">{estadisticas.total_enviadas_mes}</h3>
            <p className="stat-sublabel">este mes</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">📊</div>
          <div>
            <p className="stat-label">Tasa de Apertura</p>
            <h3 className="stat-value">{estadisticas.tasa_apertura_promedio}%</h3>
            <p className="stat-sublabel">+5% vs mes anterior</p>
          </div>
        </div>
      </div>

      {/* Formulario de nueva notificación */}
      {mostrarFormulario && (
        <div className="form-card">
          <h3>✉️ Crear Nueva Notificación</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="titulo">Título *</label>
                <input
                  id="titulo"
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Título de la notificación"
                  required
                  disabled={enviando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="destinatarios">Destinatarios *</label>
                <select
                  id="destinatarios"
                  name="destinatarios"
                  value={formData.destinatarios}
                  onChange={handleChange}
                  disabled={enviando}
                >
                  <option value="todos">Todos los usuarios</option>
                  <option value="activos">Solo usuarios activos</option>
                  <option value="admin">Solo administradores</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mensaje">Mensaje *</label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Escribe tu mensaje aquí..."
                rows="5"
                required
                disabled={enviando}
              />
              <small className="form-hint">
                {formData.mensaje.length} / 500 caracteres
              </small>
            </div>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={enviando}
            >
              {enviando ? "📤 Enviando..." : "📨 Enviar Notificación"}
            </button>
          </form>

          {/* Plantillas rápidas */}
          <div className="plantillas-section">
            <h4>⚡ Plantillas Rápidas</h4>
            <div className="plantillas-grid">
              {plantillas.map((plantilla, index) => (
                <button
                  key={index}
                  className="plantilla-btn"
                  onClick={() => aplicarPlantilla(plantilla)}
                  disabled={enviando}
                >
                  {plantilla.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Historial de notificaciones */}
      <div className="historial-card">
        <h3>📋 Historial de Notificaciones</h3>
        
        {notificaciones.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No hay notificaciones enviadas</p>
            <button 
              onClick={() => setMostrarFormulario(true)}
              className="btn-secondary"
            >
              Enviar primera notificación
            </button>
          </div>
        ) : (
          <div className="notificaciones-list">
            {notificaciones.map((notif, index) => (
              <div key={notif._id || index} className="notificacion-item">
                <div className="notif-header">
                  <div className="notif-info">
                    <h4>{notif.titulo}</h4>
                    <p className="notif-mensaje">{notif.mensaje}</p>
                  </div>
                  <span className={`notif-estado ${notif.estado === "Enviado" ? "enviado" : ""}`}>
                    {notif.estado}
                  </span>
                </div>
                
                <div className="notif-footer">
                  <div className="notif-stats">
                    <span className="notif-stat">
                      👥 {notif.destinatarios_count} destinatarios
                    </span>
                    <span className="notif-stat">
                      📊 {notif.tasa_apertura || 0}% tasa de apertura
                    </span>
                  </div>
                  <span className="notif-fecha">
                    {formatearFecha(notif.fecha)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de programadas (opcional) */}
      <div className="programadas-section">
        <h3>⏰ Programadas</h3>
        <div className="empty-state-small">
          <p>No hay notificaciones programadas</p>
          <button className="btn-link" onClick={() => setMostrarFormulario(true)}>
            ➕ Programar Nueva
          </button>
        </div>
      </div>
    </div>
  );
}