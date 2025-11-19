import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ============================================
// 📦 IMPORTAR COMPONENTES
// ============================================
// Landing Pages
import LandingPage from "./landing/ui/LandingPage";
import RewardsPage from "./landing/ui/RewardsPage";

// Admin Panel
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

// ============================================
// 🔐 COMPONENTE DE RUTA PROTEGIDA
// ============================================
function ProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("admin") === "true";
  
  if (!isAdmin) {
    console.log("⚠️ Acceso denegado - Redirigiendo al login");
    return <Navigate to="/admin" replace />;
  }
  
  return children;
}

// ============================================
// 🎯 COMPONENTE PRINCIPAL
// ============================================
function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar estado de autenticación al cargar
  useEffect(() => {
    const adminStatus = localStorage.getItem("admin") === "true";
    setIsAdmin(adminStatus);
    console.log("🔐 Estado de autenticación:", adminStatus ? "Admin" : "Guest");
  }, []);

  // Función para manejar login exitoso
  const handleLoginSuccess = () => {
    setIsAdmin(true);
    console.log("✅ Login exitoso");
  };

  return (
    <Router>
      <Routes>
        {/* ============================================
            🌐 RUTAS PÚBLICAS (Landing)
            ============================================ */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/recompensas" element={<RewardsPage />} />

        {/* ============================================
            🔐 RUTAS DE ADMINISTRADOR
            ============================================ */}
        
        {/* Login del Admin */}
        <Route 
          path="/admin" 
          element={
            isAdmin ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <AdminLogin onLogin={handleLoginSuccess} />
            )
          } 
        />

        {/* Dashboard del Admin (Protegido) */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* ============================================
            ❌ RUTA 404 (Opcional)
            ============================================ */}
        <Route 
          path="*" 
          element={
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              fontFamily: 'system-ui',
              background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
              color: 'white',
              textAlign: 'center',
              padding: '20px'
            }}>
              <h1 style={{ fontSize: '72px', margin: '0' }}>404</h1>
              <h2 style={{ fontSize: '24px', margin: '20px 0' }}>Página no encontrada</h2>
              <a 
                href="/" 
                style={{
                  marginTop: '20px',
                  padding: '12px 24px',
                  background: '#10b981',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600'
                }}
              >
                🏠 Volver al inicio
              </a>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;