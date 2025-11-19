import React, { useState } from "react";
import "./RegisterForm.css";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasenia: "",
    carrera: ""
  });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  // ⚠️ IMPORTANTE: Este formulario NO se usará en producción
  // Ya que Spring Boot maneja el registro desde la app móvil
  // Solo lo dejamos para testing del panel admin si es necesario
  const API_URL = "http://localhost:8000/api/usuarios/registrar/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    // Validaciones
    if (!formData.correo.endsWith("@tecsup.edu.pe")) {
      setMensaje("⚠️ Debes usar tu correo institucional (@tecsup.edu.pe)");
      setLoading(false);
      return;
    }

    if (formData.contrasenia.length < 6) {
      setMensaje("⚠️ La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          correo: formData.correo.trim().toLowerCase(),
          contrasenia: formData.contrasenia.trim(),
          carrera: formData.carrera.trim() || "No especificada"
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("✅ Registro exitoso. ¡Bienvenido a EcoCoins Campus! 🌱");
        
        // Limpiar formulario
        setFormData({
          nombre: "",
          correo: "",
          contrasenia: "",
          carrera: ""
        });
      } else {
        setMensaje(`⚠️ ${data.error || "Ocurrió un error al registrar"}`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setMensaje("❌ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="form-card">
        <div className="form-header">
          <div className="form-icon">🌱</div>
          <h1 className="form-title">EcoCoins Campus</h1>
          <p className="form-subtitle">Crea tu cuenta y únete al cambio verde</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez García"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Institucional *</label>
            <input
              id="correo"
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="usuario@tecsup.edu.pe"
              disabled={loading}
              required
            />
            <small className="form-hint">
              Debe ser tu correo institucional @tecsup.edu.pe
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="carrera">Carrera</label>
            <input
              id="carrera"
              type="text"
              name="carrera"
              value={formData.carrera}
              onChange={handleChange}
              placeholder="Ej: Ingeniería de Software"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasenia">Contraseña *</label>
            <input
              id="contrasenia"
              type="password"
              name="contrasenia"
              value={formData.contrasenia}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
              required
            />
            <small className="form-hint">
              Usa una contraseña segura de al menos 6 caracteres
            </small>
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Registrando...
              </>
            ) : (
              "🌱 Crear Cuenta"
            )}
          </button>
        </form>

        {mensaje && (
          <div className={`mensaje ${mensaje.includes("✅") ? "success" : "error"}`}>
            {mensaje}
          </div>
        )}

        <div className="form-footer">
          <p>
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </p>
        </div>

        <div className="form-note">
          <p>
            ℹ️ <strong>Nota:</strong> En producción, el registro se realiza desde la app móvil.
          </p>
        </div>
      </div>
    </div>
  );
}