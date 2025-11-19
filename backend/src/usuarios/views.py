"""
Views de Gestión de Usuarios - SOLO PARA PANEL ADMIN
Endpoints exclusivos para administradores del panel web
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from utils.mongo_connection import get_db


# ============================================================
# 🔐 AUTENTICACIÓN DE ADMINISTRADORES
# ============================================================

@api_view(['POST'])
def login_admin(request):
    """
    Login EXCLUSIVO para administradores del panel web
    
    Body JSON:
        {
            "correo": "admin@tecsup.edu.pe",
            "contrasenia": "admin123"
        }
    """
    try:
        db = get_db()
        
        if db is None:
            return Response(
                {"error": "No se pudo conectar con la base de datos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        correo = request.data.get("correo", "").strip().lower()
        contrasenia = request.data.get("contrasenia", "").strip()

        if not correo or not contrasenia:
            return Response(
                {"error": "Correo y contraseña son obligatorios"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Buscar SOLO administradores
        admin = db["usuarios"].find_one({
            "correo": correo,
            "contrasenia": contrasenia,
            "rol": "admin"
        })

        if not admin:
            return Response(
                {"error": "Credenciales incorrectas o sin permisos de administrador"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        admin_id = str(admin["_id"])
        
        print(f"✅ Admin {correo} accedió al panel")
        
        return Response({
            "mensaje": "Acceso autorizado",
            "nombre": admin["nombre"],
            "correo": admin["correo"],
            "rol": admin["rol"],
            "token": f"admin_token_{admin_id}"
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"❌ Error en login_admin: {e}")
        return Response(
            {"error": f"Error interno: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ============================================================
# 👥 GESTIÓN DE USUARIOS (SOLO ADMINS)
# ============================================================

@api_view(['POST'])
def cambiar_estado_usuario(request):
    """
    Activar o suspender un usuario
    
    Body JSON:
        {
            "correo": "usuario@tecsup.edu.pe",
            "estado": "suspendido"
        }
    """
    try:
        db = get_db()
        
        if db is None:
            return Response(
                {"error": "No se pudo conectar con la base de datos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        correo = request.data.get("correo", "").strip().lower()
        estado = request.data.get("estado", "").strip().lower()
        
        if not correo or estado not in ("activo", "suspendido"):
            return Response(
                {"error": "Datos inválidos"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        result = db["usuarios"].update_one(
            {"correo": correo}, 
            {"$set": {"estado": estado}}
        )
        
        if result.matched_count == 0:
            return Response(
                {"error": "Usuario no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        print(f"✅ {correo} → {estado}")
        
        return Response({
            "mensaje": f"Estado actualizado a {estado}",
            "correo": correo,
            "nuevo_estado": estado
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"❌ Error en cambiar_estado: {e}")
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def alternar_rol_usuario(request):
    """
    Cambiar rol de usuario a admin o viceversa
    
    Body JSON:
        {
            "correo": "usuario@tecsup.edu.pe"
        }
    """
    try:
        db = get_db()
        
        if db is None:
            return Response(
                {"error": "No se pudo conectar con la base de datos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        correo = request.data.get("correo", "").strip().lower()
        
        if not correo:
            return Response(
                {"error": "Correo requerido"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        usuario = db["usuarios"].find_one({"correo": correo})
        
        if not usuario:
            return Response(
                {"error": "Usuario no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        rol_actual = usuario.get("rol", "usuario")
        nuevo_rol = "admin" if rol_actual != "admin" else "usuario"
        
        db["usuarios"].update_one(
            {"correo": correo}, 
            {"$set": {"rol": nuevo_rol}}
        )
        
        print(f"✅ {correo}: {rol_actual} → {nuevo_rol}")
        
        return Response({
            "mensaje": "Rol actualizado",
            "correo": correo,
            "rol_anterior": rol_actual,
            "rol_nuevo": nuevo_rol
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"❌ Error en alternar_rol: {e}")
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def eliminar_usuario(request):
    """
    Eliminar un usuario permanentemente
    
    Body JSON:
        {
            "correo": "usuario@tecsup.edu.pe"
        }
    """
    try:
        db = get_db()
        
        if db is None:
            return Response(
                {"error": "No se pudo conectar con la base de datos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        correo = request.data.get("correo", "").strip().lower()
        
        if not correo:
            return Response(
                {"error": "Correo requerido"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        result = db["usuarios"].delete_one({"correo": correo})
        
        if result.deleted_count == 0:
            return Response(
                {"error": "Usuario no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        print(f"⚠️ Usuario {correo} eliminado")
        
        return Response({
            "mensaje": "Usuario eliminado",
            "correo": correo
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"❌ Error en eliminar: {e}")
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )