import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend
} from "recharts";
import "./EstadisticasPanel.css";

export default function EstadisticasPanel() {
  const [estadisticas, setEstadisticas] = useState({
    total_usuarios: 0,
    activos: 0,
    suspendidos: 0,
    total_reciclajes: 0,
    materiales: [],
    total_ecoCoins_generadas: 0
  });
  const [loading, setLoading] = useState(true);
  const API_BASE = "/api/panel"; // proxy en package.json

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(`${API_BASE}/estadisticas/`);
        const data = await res.json();
        setEstadisticas(data);
      } catch (err) {
        console.error("Error cargando estadísticas:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const COLORS = ["#047857", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];

  if (loading) return <div className="loading-stats">🌱 Cargando estadísticas...</div>;

  return (
    <section className="card estadisticas-panel">
      <h2>📊 Estadísticas Generales</h2>
      <div className="stats-overview">
        <div className="stat-item">
          <h3>👥 Usuarios Totales</h3>
          <p>{estadisticas.total_usuarios}</p>
        </div>
        <div className="stat-item">
          <h3>🟢 Activos</h3>
          <p>{estadisticas.activos}</p>
        </div>
        <div className="stat-item">
          <h3>🔴 Suspendidos</h3>
          <p>{estadisticas.suspendidos}</p>
        </div>
        <div className="stat-item">
          <h3>♻️ Reciclajes</h3>
          <p>{estadisticas.total_reciclajes}</p>
        </div>
        <div className="stat-item">
          <h3>🌿 EcoCoins Generadas</h3>
          <p>{estadisticas.total_ecoCoins_generadas}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h3>Usuarios activos vs suspendidos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Activos", value: estadisticas.activos },
                  { name: "Suspendidos", value: estadisticas.suspendidos }
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Materiales más reciclados</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={estadisticas.materiales}>
              <XAxis dataKey="tipo_material" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#047857" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
