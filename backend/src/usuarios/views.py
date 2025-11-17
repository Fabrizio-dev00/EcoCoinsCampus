from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime
from mongo_connection import get_db
from bson import ObjectId


@api_view(['POST'])
def login_usuario(request):
    """Login para usuarios normales"""
    try:
        db = get_db()
        correo = request.data.get("correo", "").strip().lower()
        contrasenia = request.data.get("contrasenia", "").strip()
        
        if not correo or not contrasenia:
            return Response({"error": "Correo y contraseña requeridos"}, status=400)
        
        usuario = db["usuarios"].find_one({
            "correo": correo,
            "contrasenia": contrasenia
        })
        
        if not usuario:
            return Response({"error": "Credenciales incorrectas"}, status=401)
        
        if usuario.get("estado") != "activo":
            return Response({"error": "Usuario suspendido"}, status=403)
        
        # Convertir ObjectId a string
        usuario["_id"] = str(usuario["_id"])
        
        return Response({
            "mensaje": "Login exitoso",
            "usuario": {
                "_id": usuario["_id"],
                "nombre": usuario["nombre"],
                "correo": usuario["correo"],  # ⚠️ Tu Android espera "email"
                "rol": usuario.get("rol", "usuario"),
                "eco_coins": usuario.get("ecoCoins", 0)
            },
            "token": "fake_token_123"
        }, status=200)
        
    except Exception as e:
        return Response({"error": str(e)}, status=500)

# ============================================================
# 🟢 REGISTRO DE USUARIOS
# ============================================================
@api_view(['POST'])
def registrar_usuario(request):
    """
    Endpoint para registrar un nuevo usuario en la base de datos MongoDB Atlas.
    """
    try:
        db = get_db()
        if db is None:
            return Response({"error": "No se pudo conectar con la base de datos"}, status=500)

        usuarios = db["usuarios"]

        nombre = request.data.get("nombre", "").strip()
        correo = request.data.get("correo", "").strip().lower()
        contrasenia = request.data.get("contrasenia", "").strip()

        # 🧩 Validaciones básicas
        if not nombre or not correo or not contrasenia:
            return Response({"error": "Todos los campos son obligatorios"}, status=400)

        if not correo.endswith("@tecsup.edu.pe"):
            return Response({"error": "Debe usar su correo institucional (@tecsup.edu.pe)"}, status=400)

        # Verificar si el correo ya existe
        if usuarios.find_one({"correo": correo}):
            return Response({"error": "Este correo ya está registrado"}, status=400)

        # Crear nuevo usuario
        nuevo_usuario = {
            "nombre": nombre,
            "correo": correo,
            "contrasenia": contrasenia,  # ⚠️ luego se encriptará
            "fecha_registro": datetime.now(),
            "ecoCoins": 0,
            "rol": "usuario",  # también podría ser "admin"
            "estado": "activo",
            "confirmado": False
        }

        usuarios.insert_one(nuevo_usuario)
        print(f"✅ Usuario {correo} registrado correctamente")

        return Response({"mensaje": "Usuario registrado correctamente 🎉"}, status=201)

    except Exception as e:
        print("❌ Error en registrar_usuario:", e)
        return Response({"error": f"Error interno del servidor: {str(e)}"}, status=500)


# ============================================================
# 🔐 LOGIN ADMINISTRADOR
# ============================================================
@api_view(['POST'])
def login_admin(request):
    """
    Endpoint para inicio de sesión del administrador.
    """
    try:
        db = get_db()
        if db is None:
            return Response({"error": "No se pudo conectar con la base de datos"}, status=500)

        usuarios = db["usuarios"]

        correo = request.data.get("correo", "").strip().lower()
        contrasenia = request.data.get("contrasenia", "").strip()

        if not correo or not contrasenia:
            return Response({"error": "Debe ingresar su correo y contraseña"}, status=400)

        # Buscar usuario con rol de admin
        admin = usuarios.find_one({
            "correo": correo,
            "contrasenia": contrasenia,
            "rol": "admin"
        })

        if not admin:
            return Response({"error": "Credenciales incorrectas o sin permisos"}, status=401)

        # ✅ Login exitoso
        print(f"🟢 Admin {correo} inició sesión correctamente")
        return Response({
            "mensaje": "Acceso autorizado ✅",
            "nombre": admin["nombre"],
            "rol": admin["rol"]
        }, status=200)

    except Exception as e:
        print("❌ Error en login_admin:", e)
        return Response({"error": f"Error interno del servidor: {str(e)}"}, status=500)

@api_view(['GET'])
def listar_usuarios(request):
    """
    Devuelve lista de usuarios (sin _id para simplicidad).
    """
    try:
        db = get_db()
        usuarios = list(db["usuarios"].find({}, {"contrasenia": 0}))  # ocultamos contrasenia
        # Convertir ObjectId a string si existe
        for u in usuarios:
            if "_id" in u:
                u["_id"] = str(u["_id"])
        return Response(usuarios, status=200)
    except Exception as e:
        print("❌ Error en listar_usuarios:", e)
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def cambiar_estado_usuario(request):
    """
    Body JSON: { "correo": "user@tecsup.edu.pe", "estado": "suspendido" }
    """
    try:
        db = get_db()
        correo = request.data.get("correo", "").strip().lower()
        estado = request.data.get("estado", "").strip().lower()
        if not correo or estado not in ("activo", "suspendido"):
            return Response({"error": "Datos inválidos"}, status=400)

        result = db["usuarios"].update_one({"correo": correo}, {"$set": {"estado": estado}})
        if result.matched_count == 0:
            return Response({"error": "Usuario no encontrado"}, status=404)

        return Response({"mensaje": "Estado actualizado"}, status=200)
    except Exception as e:
        print("❌ Error en cambiar_estado_usuario:", e)
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def alternar_rol_usuario(request):
    """
    Body JSON: { "correo": "user@tecsup.edu.pe" }
    Alterna rol: si era 'usuario' lo pone 'admin', si era 'admin' lo pone 'usuario'
    """
    try:
        db = get_db()
        correo = request.data.get("correo", "").strip().lower()
        if not correo:
            return Response({"error": "Correo requerido"}, status=400)

        usuario = db["usuarios"].find_one({"correo": correo})
        if not usuario:
            return Response({"error": "Usuario no encontrado"}, status=404)

        nuevo_rol = "admin" if usuario.get("rol") != "admin" else "usuario"
        db["usuarios"].update_one({"correo": correo}, {"$set": {"rol": nuevo_rol}})
        return Response({"mensaje": f"Rol cambiado a {nuevo_rol}", "rol": nuevo_rol}, status=200)
    except Exception as e:
        print("❌ Error en alternar_rol_usuario:", e)
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def eliminar_usuario(request):
    """
    Body JSON: { "correo": "user@tecsup.edu.pe" }
    """
    try:
        db = get_db()
        correo = request.data.get("correo", "").strip().lower()
        if not correo:
            return Response({"error": "Correo requerido"}, status=400)

        result = db["usuarios"].delete_one({"correo": correo})
        if result.deleted_count == 0:
            return Response({"error": "Usuario no encontrado"}, status=404)

        return Response({"mensaje": "Usuario eliminado"}, status=200)
    except Exception as e:
        print("❌ Error en eliminar_usuario:", e)
        return Response({"error": str(e)}, status=500)