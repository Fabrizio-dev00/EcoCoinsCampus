import React, { useState } from "react";
import "./AdminLogin.css";

export default function AdminLogin({ onLogin }) {
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const res = await fetch("/api/usuarios/login_admin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasenia }),
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje("✅ Bienvenido administrador");
        localStorage.setItem("admin", "true");
        onLogin(); // redirige al panel
      } else {
        setMensaje(`❌ ${data.error}`);
      }
    } catch {
      setMensaje("⚠️ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Panel Administrativo 🌱</h2>
      <form onSubmit={handleSubmit}>
        <label>Correo:</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="admin@tecsup.edu.pe"
          required
        />
        <label>Contraseña:</label>
        <input
          type="password"
          value={contrasenia}
          onChange={(e) => setContrasenia(e.target.value)}
          placeholder="••••••••"
          required
        />
        <button disabled={loading}>
          {loading ? "Verificando..." : "Ingresar"}
        </button>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>
    </div>
  );
}
