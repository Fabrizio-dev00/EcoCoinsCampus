import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend, CartesianGrid, LineChart, Line
} from "recharts";
import "./EstadisticasPanel.css";

export default function EstadisticasPanel({ estadisticas: estadisticasProps, onRefresh }) {
  const [estadisticas, setEstadisticas] = useState({
    total_usuarios: 0,
    activos: 0,
    suspendidos: 0,
    total_reciclajes: 0,
    materiales_mas_reciclados: [],
    total_ecoCoins_generadas: 0
  });
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:8000/api/panel/estadisticas/";

  useEffect(() => {
    if (estadisticasProps && Object.keys(estadisticasProps).length > 0) {
      setEstadisticas(estadisticasProps);
    } else {
      loadStats();
    }
  }, [estadisticasProps]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setEstadisticas(data);
    } catch (err) {
      console.error("❌ Error cargando estadísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      loadStats();
    }
  };

  // Calcular tasa de participación
  const tasaParticipacion = estadisticas.total_usuarios > 0 
    ? Math.round((estadisticas.activos / estadisticas.total_usuarios) * 100)
    : 0;

  // Datos para gráfica de torta
  const dataPie = [
    { name: "Activos", value: estadisticas.activos || 0, color: "#10b981" },
    { name: "Suspendidos", value: estadisticas.suspendidos || 0, color: "#ef4444" }
  ];

  // Datos simulados para gráficas mensuales
  const dataReciclajes = [
    { mes: "Ene", cantidad: 45 },
    { mes: "Feb", cantidad: 52 },
    { mes: "Mar", cantidad: 61 },
    { mes: "Abr", cantidad: 58 },
    { mes: "May", cantidad: 70 },
    { mes: "Jun", cantidad: 85 }
  ];

  const dataEcoCoins = [
    { mes: "Ene", coins: 1200 },
    { mes: "Feb", coins: 1500 },
    { mes: "Mar", coins: 1750 },
    { mes: "Abr", coins: 1650 },
    { mes: "May", coins: 1950 },
    { mes: "Jun", coins: 2400 }
  ];

  // Actividad reciente simulada
  const actividadReciente = [
    { nombre: "Ana García", accion: "registró 3 reciclajes", coins: "+15 EcoCoins", tiempo: "Hace 5 min" },
    { nombre: "Carlos López", accion: "canjeó una recompensa", coins: "-50 EcoCoins", tiempo: "Hace 15 min" }
  ];

  if (loading) {
    return (
      <div className="loading-stats">
        <div className="spinner"></div>
        <p>🌱 Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="estadisticas-panel-lovable">
      {/* ============================================
          📌 HEADER
          ============================================ */}
      <div className="panel-header-lovable">
        <div className="header-left">
          <h1>📊 Panel de Estadísticas</h1>
          <p className="header-subtitle">Resumen general de EcoCoins Campus</p>
        </div>
        <button onClick={handleRefresh} className="btn-refresh-stats">
          🔄 Actualizar
        </button>
      </div>

      {/* ============================================
          📈 TARJETAS DE RESUMEN
          ============================================ */}
      <div className="stats-cards-grid">
        <div className="stat-card-lovable green">
          <div className="stat-card-icon">👥</div>
          <div className="stat-card-content">
            <p className="stat-card-label">Total Usuarios</p>
            <h3 className="stat-card-value">
              {(estadisticas.total_usuarios || 1284).toLocaleString()}
            </h3>
            <p className="stat-card-change positive">+12% desde el mes pasado</p>
          </div>
        </div>

        <div className="stat-card-lovable blue">
          <div className="stat-card-icon">♻️</div>
          <div className="stat-card-content">
            <p className="stat-card-label">Reciclajes Totales</p>
            <h3 className="stat-card-value">
              {(estadisticas.total_reciclajes || 3456).toLocaleString()}
            </h3>
            <p className="stat-card-change positive">+8% desde el mes pasado</p>
          </div>
        </div>

        <div className="stat-card-lovable purple">
          <div className="stat-card-icon">🌿</div>
          <div className="stat-card-content">
            <p className="stat-card-label">EcoCoins Distribuidas</p>
            <h3 className="stat-card-value">
              {(estadisticas.total_ecoCoins_generadas || 24580).toLocaleString()}
            </h3>
            <p className="stat-card-change positive">+15% desde el mes pasado</p>
          </div>
        </div>

        <div className="stat-card-lovable orange">
          <div className="stat-card-icon">📊</div>
          <div className="stat-card-content">
            <p className="stat-card-label">Tasa de Participación</p>
            <h3 className="stat-card-value">{tasaParticipacion}%</h3>
            <p className="stat-card-change positive">+5% desde el mes pasado</p>
          </div>
        </div>
      </div>

      {/* ============================================
          📊 GRÁFICAS
          ============================================ */}
      <div className="charts-grid-lovable">
        {/* Reciclajes por Mes */}
        <div className="chart-card-lovable">
          <h3>♻️ Reciclajes por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataReciclajes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="cantidad" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* EcoCoins Generadas */}
        <div className="chart-card-lovable">
          <h3>🌿 EcoCoins Generadas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataEcoCoins}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="coins" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ============================================
          📋 ACTIVIDAD RECIENTE
          ============================================ */}
      <div className="actividad-reciente-card">
        <h3>⚡ Actividad Reciente</h3>
        <div className="actividad-list">
          {actividadReciente.map((actividad, index) => (
            <div key={index} className="actividad-item">
              <div className="actividad-left">
                <p className="actividad-nombre">{actividad.nombre}</p>
                <p className="actividad-accion">{actividad.accion}</p>
              </div>
              <div className="actividad-right">
                <p className={`actividad-coins ${actividad.coins.includes('+') ? 'positive' : 'negative'}`}>
                  {actividad.coins}
                </p>
                <p className="actividad-tiempo">{actividad.tiempo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}