import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import UsuariosTable from "./UsuariosTable";
import Sidebar from "./Sidebar";
import EstadisticasPanel from "./EstadisticasPanel";

export default function AdminDashboard() {
  const [section, setSection] = useState("usuarios");
  const [reciclajes, setReciclajes] = useState([]);
  const [recompensas, setRecompensas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);

  const API_BASE = "/api/panel"; // proxy configurado

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      await Promise.all([
        fetchData("reciclajes", setReciclajes),
        fetchData("recompensas", setRecompensas),
        fetchData("estadisticas", setEstadisticas),
      ]);
      setLoading(false);
    }
    loadAll();
  }, []);

  const fetchData = async (ruta, setter) => {
    try {
      const res = await fetch(`${API_BASE}/${ruta}/`);
      if (!res.ok) {
        console.error(`Error al obtener ${ruta}:`, res.status);
        setter([]);
        return;
      }
      const data = await res.json();
      setter(data);
    } catch (err) {
      console.error(`Fetch ${ruta} failed:`, err);
      setter([]);
    }
  };

  // 🔸 Controlador de secciones dinámicas
  const renderSection = () => {
    if (loading) return <div className="loading">Cargando datos…</div>;

    switch (section) {
      case "usuarios":
        return (
          <section className="card">
            <h2>👥 Usuarios</h2>
            <UsuariosTable />
          </section>
        );

      case "reciclajes":
        return (
          <section className="card">
            <h2>♻️ Reciclajes</h2>
            <div className="list">
              {reciclajes.length === 0 ? (
                <div className="empty">No hay registros</div>
              ) : (
                reciclajes.slice(0, 12).map((r, i) => (
                  <div className="list-item" key={i}>
                    <div className="li-left">
                      <div className="li-title">{(r.tipo_material ?? r.tipo) || "Material"}</div>
                      <div className="li-sub">Usuario: {r.usuario_id ?? "—"}</div>
                    </div>
                    <div className="li-right">
                      <div>{r.ecoCoins_ganadas ?? r.ecoCoins ?? 0} ♻️</div>
                      <div className="muted">{new Date(r.fecha).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        );

      case "recompensas":
        return (
          <section className="card">
            <h2>🎁 Recompensas</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Costo</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {recompensas.length === 0 ? (
                  <tr><td colSpan="4" className="empty">No hay recompensas</td></tr>
                ) : (
                  recompensas.map((r, i) => (
                    <tr key={i}>
                      <td>{r.nombre}</td>
                      <td>{r.descripcion}</td>
                      <td>{r.costoEcoCoins}</td>
                      <td>{r.stock}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        );

      case "estadisticas":
        return (
          <section className="card stats-card">
            <EstadisticasPanel />
          </section>
        );

      default:
        return <div className="placeholder">Selecciona una sección</div>;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activeSection={section} onSelect={setSection} />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>🌱 EcoCoins Campus — Panel Administrativo</h1>
          <p>Gestiona usuarios, reciclajes, recompensas y estadísticas del sistema.</p>
        </header>
        <div className="dashboard-content">{renderSection()}</div>
      </main>
    </div>
  );
}
