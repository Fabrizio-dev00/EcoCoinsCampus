# 🌱 EcoCoins Campus

<div align="center">

![EcoCoins Logo](https://img.shields.io/badge/EcoCoins-Campus-10b981?style=for-the-badge&logo=leaf)
![Status](https://img.shields.io/badge/Status-En%20Desarrollo-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Sistema integral de gestión de reciclaje universitario con recompensas digitales**

[🚀 Demo](#-demo) • [📖 Documentación](#-documentación) • [🛠️ Instalación](#️-instalación) • [🤝 Contribuir](#-contribuir)

</div>

---

## 📋 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación](#️-instalación)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## 🎯 Acerca del Proyecto

**EcoCoins Campus** es una plataforma innovadora diseñada para incentivar el reciclaje en entornos universitarios mediante un sistema de recompensas digitales. Los estudiantes pueden depositar materiales reciclables en puntos de recolección inteligentes y ganar **EcoCoins**, que luego pueden canjear por productos, descuentos y beneficios dentro del campus.

### 🌟 Problema que Resuelve

- ❌ Baja participación en programas de reciclaje universitarios
- ❌ Falta de incentivos tangibles para reciclar
- ❌ Dificultad para medir el impacto ambiental individual
- ❌ Gestión manual y poco eficiente de los materiales reciclados

### ✅ Solución

- ✅ **Gamificación**: Sistema de puntos que motiva la participación
- ✅ **Recompensas Reales**: Catálogo de premios canjeables
- ✅ **Impacto Medible**: Estadísticas en tiempo real del CO₂ ahorrado
- ✅ **Gestión Automatizada**: Panel administrativo completo

---

## ✨ Características

### 🎮 Para Usuarios (App Móvil)

- 📱 **Registro y Login Seguro** con validación institucional
- ♻️ **Registro de Reciclajes** mediante códigos QR en puntos de recolección
- 💰 **Billetera Digital** con historial de EcoCoins
- 🎁 **Catálogo de Recompensas** con stock en tiempo real
- 📊 **Dashboard Personal** con estadísticas de impacto ambiental
- 🏆 **Sistema de Niveles** (Bronce, Plata, Oro, Platino)
- 📈 **Ranking Global** de mejores recicladores
- 🔔 **Notificaciones Push** de nuevas recompensas y logros

### 👨‍💼 Para Administradores (Panel Web)

- 🖥️ **Dashboard Completo** con métricas clave
- 👥 **Gestión de Usuarios** (CRUD completo)
- ♻️ **Historial de Reciclajes** con filtros avanzados
- 🎁 **Administración de Recompensas** (stock, precios, categorías)
- 💳 **Registro de Transacciones** (ganadas y canjeadas)
- 🔔 **Sistema de Notificaciones** con plantillas rápidas
- 📊 **Reportes y Estadísticas** exportables
- 🌍 **Cálculo de Impacto Ambiental** (CO₂, árboles salvados)

---

## 🛠️ Tecnologías

### Frontend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| ![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react) | 18.2.0 | Panel Web Admin |
| ![React Native](https://img.shields.io/badge/React_Native-0.72-61DAFB?logo=react) | 0.72 | App Móvil |
| ![React Router](https://img.shields.io/badge/React_Router-6.20-CA4245?logo=react-router) | 6.20 | Navegación Web |
| ![Recharts](https://img.shields.io/badge/Recharts-2.10-22B5BF?logo=chart-dot-js) | 2.10 | Gráficas |

### Backend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| ![Django](https://img.shields.io/badge/Django-4.2.7-092E20?logo=django) | 4.2.7 | API Panel Admin |
| ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?logo=springboot) | 3.2 | API App Móvil |
| ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb) | Atlas | Base de Datos |
| ![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=json-web-tokens) | - | Autenticación |

### Infraestructura
```
📊 Base de Datos:     MongoDB Atlas (Cloud)
🔐 Autenticación:     JWT + Spring Security
🌐 CORS:              Configurado para desarrollo y producción
📦 Package Manager:   npm (Frontend) | pip (Django) | Maven (Spring)
```

---

## 🏗️ Arquitectura
```
┌─────────────────────────────────────────────────────┐
│             MONGODB ATLAS (Cloud Database)           │
│         Colecciones: usuarios, reciclajes,          │
│         recompensas, canjes, notificaciones         │
└─────────────────────────────────────────────────────┘
           ↑                           ↑
           │                           │
    ┌──────┴──────────┐       ┌────────┴─────────┐
    │  DJANGO REST    │       │  SPRING BOOT     │
    │    Backend      │       │    Backend       │
    │  Puerto: 8000   │       │  Puerto: 8080    │
    │                 │       │                  │
    │  • Estadísticas │       │  • Autenticación │
    │  • Panel Admin  │       │  • Reciclajes    │
    │  • Notificaciones│      │  • Recompensas   │
    └──────┬──────────┘       └────────┬─────────┘
           │                           │
           ↓                           ↓
    ┌──────────────┐           ┌──────────────┐
    │  REACT WEB   │           │ REACT NATIVE │
    │ Panel Admin  │           │  App Móvil   │
    │ Puerto: 3000 │           │  Android/iOS │
    └──────────────┘           └──────────────┘
```

### 📂 Estructura del Proyecto
```
EcoCoinsCampus/
│
├── backend/                    # Django Backend (Panel Admin)
│   └── src/
│       ├── ecocoins_backend/   # Configuración principal
│       ├── usuarios/           # App de usuarios
│       ├── panel_admin/        # App del panel admin
│       └── utils/              # Utilidades (conexión DB)
│
├── backend-spring/             # Spring Boot Backend (App Móvil)
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/tecsup/ecocoins/
│           │       ├── models/
│           │       ├── repositories/
│           │       ├── services/
│           │       ├── controllers/
│           │       └── config/
│           └── resources/
│               └── application.properties
│
└── frontend/                   # React Frontend
    └── ecocoins-web/
        └── src/
            ├── components/     # Componentes reutilizables
            ├── landing/        # Landing pages
            └── App.js          # Componente principal
```

---

## 🚀 Instalación

### Prerequisitos
```bash
# Verificar versiones instaladas
node --version    # v18.0.0 o superior
npm --version     # v9.0.0 o superior
python --version  # Python 3.10 o superior
java --version    # Java 17 o superior
```

### 1️⃣ Clonar el Repositorio
```bash
git clone https://github.com/FabrizioJimenez/EcoCoinsCampus.git
cd EcoCoinsCampus
```

### 2️⃣ Backend Django (Panel Admin)
```bash
cd backend/src

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
python manage.py runserver
# Servidor corriendo en: http://localhost:8000
```

### 3️⃣ Backend Spring Boot (App Móvil)
```bash
cd backend-spring

# Con Maven
./mvnw spring-boot:run

# O con IntelliJ IDEA:
# 1. Abrir el proyecto en IntelliJ
# 2. Esperar a que Maven descargue dependencias
# 3. Run > Run 'EcoCoinsApplication'

# Servidor corriendo en: http://localhost:8080
```

### 4️⃣ Frontend React (Panel Admin)
```bash
cd frontend/ecocoins-web

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
# Aplicación corriendo en: http://localhost:3000
```

### 5️⃣ Configurar Variables de Entorno

Crea un archivo `.env` en cada directorio:

**Backend Django (`backend/src/.env`):**
```env
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/
SECRET_KEY=tu-clave-secreta-django
DEBUG=True
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**Backend Spring (`backend-spring/src/main/resources/application.properties`):**
```properties
spring.data.mongodb.uri=mongodb+srv://usuario:password@cluster.mongodb.net/EcoCoinsCampus
jwt.secret=tu-clave-secreta-jwt
server.port=8080
```

**Frontend React (`frontend/ecocoins-web/.env`):**
```env
REACT_APP_API_DJANGO=http://localhost:8000
REACT_APP_API_SPRING=http://localhost:8080
```

---

## 💻 Uso

### Acceso al Panel Administrativo

1. Navega a `http://localhost:3000/admin`
2. Usa las credenciales por defecto:
```
   Correo: admin@tecsup.edu.pe
   Contraseña: admin123
```

### Probar API con Postman

Importa la colección de Postman incluida en `/docs/postman/EcoCoins.postman_collection.json`

### Crear Usuario de Prueba
```bash
# Endpoint de registro
POST http://localhost:8080/api/auth/register

# Body
{
  "nombre": "Juan Pérez",
  "correo": "juan.perez@tecsup.edu.pe",
  "contrasenia": "password123",
  "carrera": "Ingeniería de Software"
}
```

---

## 📡 API Endpoints

### Django Backend (Puerto 8000)

#### Autenticación
```http
POST   /api/usuarios/login_admin/
POST   /api/usuarios/registro_admin/
```

#### Panel Admin
```http
GET    /api/panel/estadisticas/
GET    /api/panel/usuarios/
GET    /api/panel/reciclajes/
GET    /api/panel/recompensas/
GET    /api/panel/transacciones/
POST   /api/panel/notificaciones/crear/
```

### Spring Boot Backend (Puerto 8080)

#### Autenticación
```http
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
```

#### Usuarios
```http
GET    /api/usuarios/me
PUT    /api/usuarios/me
GET    /api/usuarios/estadisticas
GET    /api/usuarios/ranking
```

#### Reciclajes
```http
GET    /api/reciclajes
POST   /api/reciclajes
GET    /api/reciclajes/{id}
GET    /api/materiales
```

#### Recompensas
```http
GET    /api/recompensas
GET    /api/recompensas/{id}
POST   /api/recompensas/canjear
GET    /api/canjes
```

📖 **[Documentación completa de API](./docs/API.md)**

---

## 📸 Capturas de Pantalla

### Panel Administrativo

<div align="center">

| Dashboard | Gestión de Usuarios |
|:---------:|:-------------------:|
| ![Dashboard](./docs/screenshots/dashboard.png) | ![Usuarios](./docs/screenshots/usuarios.png) |

| Transacciones | Notificaciones |
|:-------------:|:--------------:|
| ![Transacciones](./docs/screenshots/transacciones.png) | ![Notificaciones](./docs/screenshots/notificaciones.png) |

</div>

---

## 🗺️ Roadmap

### ✅ Fase 1: MVP (Completado)
- [x] Backend Django con MongoDB
- [x] Panel Admin Web completo
- [x] Sistema de autenticación
- [x] CRUD de usuarios y reciclajes
- [x] Dashboard con estadísticas

### 🚧 Fase 2: App Móvil (En Desarrollo)
- [ ] Backend Spring Boot
- [ ] App React Native
- [ ] Sistema de QR codes
- [ ] Notificaciones push
- [ ] Integración completa

### 📅 Fase 3: Mejoras (Planeado)
- [ ] Análisis de datos con ML
- [ ] Recomendaciones personalizadas
- [ ] Integración con redes sociales
- [ ] Sistema de referidos
- [ ] Gamificación avanzada

### 🔮 Fase 4: Escalabilidad (Futuro)
- [ ] Multi-campus
- [ ] API pública
- [ ] SDK para terceros
- [ ] Marketplace de recompensas

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor sigue estos pasos:

1. **Fork** el proyecto
2. Crea tu **Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add: nueva característica'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Convención de Commits
```
Add:      Nueva funcionalidad
Fix:      Corrección de bug
Update:   Actualización de código existente
Remove:   Eliminación de código
Docs:     Cambios en documentación
Style:    Cambios de formato
Refactor: Refactorización de código
Test:     Añadir o modificar tests
```

### Código de Conducta

Este proyecto sigue el [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

## 👥 Equipo

<div align="center">

| Rol | Nombre | GitHub | LinkedIn |
|-----|--------|--------|----------|
| 💻 Full Stack Developer | Fabrizio Jimenez | [@FabrizioJimenez](https://github.com/FabrizioJimenez) | [LinkedIn](https://linkedin.com/in/fabrizio-jimenez) |

</div>

---

## 📞 Contacto

**Fabrizio Jimenez** - [@FabrizioJimenez](https://github.com/FabrizioJimenez)

📧 Email: fabrizio.jimenez@tecsup.edu.pe

🔗 Proyecto: [https://github.com/FabrizioJimenez/EcoCoinsCampus](https://github.com/FabrizioJimenez/EcoCoinsCampus)

---

## 🙏 Agradecimientos

- [Tecsup](https://www.tecsup.edu.pe/) - Institución educativa
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Base de datos cloud
- [React](https://reactjs.org/) - Framework frontend
- [Spring Boot](https://spring.io/projects/spring-boot) - Framework backend
- [Django](https://www.djangoproject.com/) - Framework web

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella ⭐**

![Footer](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![Footer](https://img.shields.io/badge/Powered%20by-☕-brown?style=for-the-badge)

</div>