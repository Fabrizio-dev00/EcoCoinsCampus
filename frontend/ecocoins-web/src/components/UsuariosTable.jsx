import React, { useEffect, useState } from "react";
import "./UsuariosTable.css";

export default function UsuariosTable() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos"); // todos, activos, suspendidos
  const [busqueda, setBusqueda] = useState("");

  // ✅ URLs corregidas
  const API_BASE = "http://localhost:8000/api";
  const API_PANEL = `${API_BASE}/panel`;
  const API_USUARIOS = `${API_BASE}/usuarios`;

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      // ✅ Usar endpoint del panel_admin
      const res = await fetch(`${API_PANEL}/usuarios/`);
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Usuarios cargados:", data.length);
      setUsuarios(data);
    } catch (err) {
      console.error("❌ Error al cargar usuarios:", err);
      alert("Error al cargar usuarios. Verifica que Django esté corriendo.");
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const accionEstado = async (correo, nuevoEstado) => {
    if (!window.confirm(`¿Cambiar estado de ${correo} a ${nuevoEstado}?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_USUARIOS}/estado/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, estado: nuevoEstado }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${data.mensaje || "Estado actualizado"}`);
        cargarUsuarios();
      } else {
        alert(`❌ ${data.error || "Error al actualizar estado"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error de conexión");
    }
  };

  const accionRol = async (correo) => {
    if (!window.confirm(`¿Alternar rol de ${correo}?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_USUARIOS}/rol/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${data.mensaje}\nNuevo rol: ${data.rol_nuevo}`);
        cargarUsuarios();
      } else {
        alert(`❌ ${data.error || "Error al cambiar rol"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error de conexión");
    }
  };

  const accionEliminar = async (correo) => {
    if (!window.confirm(
      `⚠️ ¿Estás seguro de eliminar a ${correo}?\n\n` +
      `Esta acción es IRREVERSIBLE y eliminará:\n` +
      `- El usuario\n` +
      `- Su historial de reciclajes\n` +
      `- Sus EcoCoins\n\n` +
      `¿Continuar?`
    )) {
      return;
    }

    try {
      const res = await fetch(`${API_USUARIOS}/eliminar/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${data.mensaje || "Usuario eliminado correctamente"}`);
        cargarUsuarios();
      } else {
        alert(`❌ ${data.error || "Error al eliminar usuario"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error de conexión");
    }
  };

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(u => {
    // Filtro por estado
    if (filtro === "activos" && u.estado !== "activo") return false;
    if (filtro === "suspendidos" && u.estado !== "suspendido") return false;

    // Filtro por búsqueda
    if (busqueda) {
      const termino = busqueda.toLowerCase();
      return (
        u.nombre?.toLowerCase().includes(termino) ||
        u.correo?.toLowerCase().includes(termino) ||
        u.carrera?.toLowerCase().includes(termino)
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="ut-loading">
        <div className="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="ut-container">
      {/* Barra de herramientas */}
      <div className="ut-toolbar">
        <div className="ut-filters">
          <button
            className={filtro === "todos" ? "active" : ""}
            onClick={() => setFiltro("todos")}
          >
            👥 Todos ({usuarios.length})
          </button>
          <button
            className={filtro === "activos" ? "active" : ""}
            onClick={() => setFiltro("activos")}
          >
            🟢 Activos ({usuarios.filter(u => u.estado === "activo").length})
          </button>
          <button
            className={filtro === "suspendidos" ? "active" : ""}
            onClick={() => setFiltro("suspendidos")}
          >
            🔴 Suspendidos ({usuarios.filter(u => u.estado === "suspendido").length})
          </button>
        </div>

        <div className="ut-search">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre, correo o carrera..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <button onClick={cargarUsuarios} className="btn-refresh">
          🔄 Actualizar
        </button>
      </div>

      {/* Tabla */}
      {usuariosFiltrados.length === 0 ? (
        <div className="ut-empty">
          <p>😔 No se encontraron usuarios</p>
        </div>
      ) : (
        <div className="ut-table-container">
          <table className="ut-table">
            <thead>
              <tr>
                <th>👤 Nombre</th>
                <th>📧 Correo</th>
                <th>🎓 Carrera</th>
                <th>🔐 Rol</th>
                <th>♻️ EcoCoins</th>
                <th>📊 Estado</th>
                <th>⚙️ Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u, i) => (
                <tr key={u._id || i}>
                  <td><strong>{u.nombre || "Sin nombre"}</strong></td>
                  <td>{u.correo || "—"}</td>
                  <td>{u.carrera || "No especificada"}</td>
                  <td>
                    <span className={`badge ${u.rol === "admin" ? "badge-admin" : "badge-user"}`}>
                      {u.rol || "usuario"}
                    </span>
                  </td>
                  <td>
                    <span className="eco-coins">
                      {u.ecoCoins || 0} ♻️
                    </span>
                  </td>
                  <td>
                    <span className={`status ${u.estado === "activo" ? "status-active" : "status-inactive"}`}>
                      {u.estado || "desconocido"}
                    </span>
                  </td>
                  <td className="ut-actions">
                    {u.estado === "activo" ? (
                      <button
                        className="btn-action btn-warn"
                        onClick={() => accionEstado(u.correo, "suspendido")}
                        title="Suspender usuario"
                      >
                        🔒 Suspender
                      </button>
                    ) : (
                      <button
                        className="btn-action btn-success"
                        onClick={() => accionEstado(u.correo, "activo")}
                        title="Activar usuario"
                      >
                        🔓 Activar
                      </button>
                    )}

                    <button
                      className="btn-action btn-info"
                      onClick={() => accionRol(u.correo)}
                      title="Cambiar rol (admin/usuario)"
                    >
                      🔄 Rol
                    </button>

                    <button
                      className="btn-action btn-danger"
                      onClick={() => accionEliminar(u.correo)}
                      title="Eliminar usuario permanentemente"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info */}
      <div className="ut-footer">
        <p>
          Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
        </p>
      </div>
    </div>
  );
}