# 🌿 EcoCoinsCampus - Backend Django

Panel Administrativo para gestionar usuarios y reciclajes

## 🚀 Instalación
```bash
cd backend/src
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r ../requirements.txt
python manage.py runserver
```

## 📡 Endpoints

- `POST /api/usuarios/login/` - Login usuario
- `POST /api/usuarios/registrar/` - Registro
- `GET /api/panel/usuarios/` - Listar usuarios
- `GET /api/panel/estadisticas/` - Estadísticas

## 🔑 Admin
```
Email: admin@tecsup.edu.pe
Password: admin123
```
```

---

### **5️⃣ FRONTEND REACT - Verificar estructura**

Tu frontend parece estar bien estructurado. Solo verifica que tengas:
```
frontend/ecocoins-web/src/
├── components/          ✅ Componentes reutilizables
├── images/              ✅ Recursos visuales
├── landing/             ✅ Landing page
├── App.js               ✅ Componente principal
└── index.js             ✅ Punto de entrada
```

**¿Tienes también las siguientes carpetas?** (Deberías tenerlas)
```
src/
├── admin/               ❓ Panel administrativo
├── pages/               ❓ Páginas (Home, Login, Register)
├── services/            ❓ Llamadas API (authService, etc)
└── styles/              ❓ CSS