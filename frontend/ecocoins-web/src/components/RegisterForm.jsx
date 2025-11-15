import React, { useState } from "react";
import "./RegisterForm.css";

const API_URL = "http://127.0.0.1:8000/api/usuarios/registrar/";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasenia: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setMensaje("✅ Registro exitoso. ¡Bienvenido a EcoCoins Campus! 🌱");
      } else {
        setMensaje(`⚠️ ${data.error || "Ocurrió un error"}`);
      }
    } catch (error) {
      setMensaje("❌ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="form-card">
        <h1 className="form-title">🌱 EcoCoins Campus</h1>
        <p className="form-subtitle">Crea tu cuenta y únete al cambio verde</p>

        <form onSubmit={handleSubmit}>
          <label>Nombre completo</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Juan Perez"
            required
          />

          <label>Correo institucional</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="usuario@tecsup.edu.pe"
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            name="contrasenia"
            value={formData.contrasenia}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarme"}
          </button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
        <p className="footer">
          ¿Ya tienes cuenta? <a href="#">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
