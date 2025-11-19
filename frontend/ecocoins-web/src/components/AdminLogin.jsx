import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin({ onLogin }) {
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = "http://localhost:8000/api/usuarios/login_admin/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    if (!correo || !contrasenia) {
      setMensaje("⚠️ Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          correo: correo.trim().toLowerCase(), 
          contrasenia: contrasenia.trim() 
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMensaje(`✅ Bienvenido ${data.nombre || "administrador"}`);
        
        // Guardar en localStorage
        localStorage.setItem("admin", "true");
        localStorage.setItem("adminNombre", data.nombre || "Admin");
        localStorage.setItem("adminCorreo", data.correo || correo);
        localStorage.setItem("adminToken", data.token || "");
        
        // Llamar callback de login
        if (onLogin) {
          onLogin();
        }
        
        // Redirigir al dashboard después de un breve delay
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      } else {
        setMensaje(`❌ ${data.error || "Credenciales incorrectas"}`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setMensaje("⚠️ Error de conexión. Verifica que Django esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🌱</div>
          <h2>Panel Administrativo</h2>
          <p className="login-subtitle">EcoCoins Campus</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="correo">Correo Institucional</label>
            <input
              id="correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="admin@tecsup.edu.pe"
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasenia">Contraseña</label>
            <input
              id="contrasenia"
              type="password"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-login"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Verificando...
              </>
            ) : (
              <>🔓 Ingresar al Panel</>
            )}
          </button>

          {mensaje && (
            <div className={`mensaje ${mensaje.includes("✅") ? "success" : "error"}`}>
              {mensaje}
            </div>
          )}
        </form>

        <div className="login-footer">
          <p className="help-text">
            💡 Credenciales por defecto:<br/>
            <code>admin@tecsup.edu.pe / admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
