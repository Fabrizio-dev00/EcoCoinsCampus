import React, { useEffect, useState } from "react";
import "./UsuariosTable.css";

export default function UsuariosTable() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/usuarios/listar/");
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error("Error cargar usuarios:", err);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const accionEstado = async (correo, nuevoEstado) => {
    if (!window.confirm(`Cambiar estado de ${correo} a ${nuevoEstado}?`)) return;
    try {
      const res = await fetch("/api/usuarios/estado/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, estado: nuevoEstado }),
      });
      if (res.ok) cargarUsuarios();
      else alert("Error actualizando estado");
    } catch (e) {
      alert("Error de conexión");
    }
  };

  const accionRol = async (correo) => {
    if (!window.confirm(`Alternar rol de ${correo}?`)) return;
    try {
      const res = await fetch("/api/usuarios/rol/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.mensaje);
        cargarUsuarios();
      } else {
        alert(data.error || "Error al cambiar rol");
      }
    } catch {
      alert("Error de conexión");
    }
  };

  const accionEliminar = async (correo) => {
    if (!window.confirm(`Eliminar usuario ${correo}? Esta acción es irreversible.`)) return;
    try {
      const res = await fetch("/api/usuarios/eliminar/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });
      if (res.ok) {
        alert("Usuario eliminado");
        cargarUsuarios();
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar");
      }
    } catch {
      alert("Error de conexión");
    }
  };

  if (loading) return <div className="ut-loading">Cargando usuarios…</div>;

  return (
    <div className="ut-card">
      <h3>Usuarios registrados</h3>
      <table className="ut-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>EcoCoins</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr><td colSpan="6" className="ut-empty">No hay usuarios</td></tr>
          ) : usuarios.map((u, i) => (
            <tr key={u._id ?? i}>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
              <td>{u.ecoCoins ?? 0}</td>
              <td>{u.estado}</td>
              <td className="ut-actions">
                {u.estado === "activo" ? (
                  <button className="btn small warn" onClick={() => accionEstado(u.correo, "suspendido")}>Suspender</button>
                ) : (
                  <button className="btn small" onClick={() => accionEstado(u.correo, "activo")}>Activar</button>
                )}
                <button className="btn small" onClick={() => accionRol(u.correo)}>Alternar Rol</button>
                <button className="btn small danger" onClick={() => accionEliminar(u.correo)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
