import React from 'react';
import ReactDOM from 'react-dom/client';

// ============================================
// 🎨 CSS - IMPORTAR EN ORDEN CORRECTO
// ============================================
import './theme.css';              // 1️⃣ Variables globales primero
import './index.css';              // 2️⃣ Reset y estilos base

// Componentes principales
import './components/AdminDashboard.css';
import './components/AdminLogin.css';
import './components/Sidebar.css';
import './components/EstadisticasPanel.css';
import './components/RegisterForm.css';
import './components/UsuariosTable.css';

// ============================================
// ⚛️ COMPONENTE PRINCIPAL
// ============================================
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Medición de performance (opcional)
reportWebVitals();