"""
Views del Panel Administrativo
Endpoints para gestionar usuarios, reciclajes, recompensas y estadísticas
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from bson import ObjectId
from utils.mongo_connection import get_db


# ============================================================
# 📊 ESTADÍSTICAS
# ============================================================

@api_view(['GET'])
def obtener_estadisticas(request):
    """
    Obtener estadísticas generales del sistema
    
    Returns:
        - total_usuarios: Total de usuarios registrados
        - activos: Usuarios con estado activo
        - suspendidos: Usuarios suspendidos
        - total_reciclajes: Total de reciclajes registrados
        - materiales: Top 5 materiales más reciclados
        - total_ecoCoins_generadas: Suma total de EcoCoins
    """
    try:
        db = get_db()
        
        if db is None:
            return Response(
                {"error": "No se pudo conectar con la base de datos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Conteos globales
        usuarios_total = db["usuarios"].count_documents({})
        reciclajes_total = db["reciclajes"].count_documents({})
        ecoCoins_total = sum(u.get("ecoCoins", 0) for u in db["usuarios"].find({}))

        # Usuarios activos vs suspendidos
        activos = db["usuarios"].count_documents({"estado": "activo"})
        suspendidos = db["usuarios"].count_documents({"estado": "suspendido"})

        # Materiales más reciclados (agregación MongoDB)
        pipeline = [
            {"$group": {
                "_id": "$tipo_material", 
                "cantidad": {"$sum": 1},
                "total_kg": {"$sum": "$cantidad"}
            }},
            {"$sort": {"cantidad": -1}},
            {"$limit": 5}
        ]
        
        materiales_cursor = db["reciclajes"].aggregate(pipeline)
        materiales = [
            {
                "tipo_material": m["_id"] if m["_id"] else "Desconocido", 
                "cantidad": m["cantidad"],
                "total_kg": m.get("total_kg", 0)
            }
            for m in materiales_cursor
        ]

        # Respuesta estructurada
        estadisticas = {
            "total_usuarios": usuarios_total,
            "activos": activos,
            "suspendidos": suspendidos,
            "total_reciclajes": reciclajes_total,
            "materiales_mas_reciclados": materiales,
            "total_ecoCoins_generadas": ecoCoins_total
        }

        return Response(estadisticas, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": f"Error al obtener estadísticas: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ============================================================
# 👥 USUARIOS
# ============================================================

@api_view(['GET'])
def obtener_usuarios(request):
    """
    Listar todos los usuarios del sistema (sin contraseñas)
    
    Returns:
        Lista de usuarios con sus datos básicos
    """
    try:
        db = get_db()
        
        if db is None:
            return Response(
                {"error": "No se pudo conectar con la base de datos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Obtener todos los usuarios SIN la contraseña
        usuarios = list(db["usuarios"].find(
            {},  # Sin filtro
            {
                "contrasenia": 0  # ✅ Excluir contraseña
            }
        ))
        
        # Convertir ObjectId a string
        for usuario in usuarios:
            if "_id" in usuario:
                usuario["_id"] = str(usuario["_id"])
            
            # ✅ Agregar valores por defecto si faltan
            usuario["ecoCoins"] = usuario.get("ecoCoins", 0)
            usuario["estado"] = usuario.get("estado", "activo")
            usuario["rol"] = usuario.get("rol", "usuario")
            usuario["carrera"] = usuario.get("carrera", "No especificada")
        
        print(f"✅ Se encontraron {len(usuarios)} usuarios")
        return Response(usuarios, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"❌ Error en obtener_usuarios: {e}")
        import traceback
        traceback.print_exc()  # ✅ Imprime el error completo en consola
        return Response(
            {"error": f"Error al obtener usuarios: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ============================================================
# ♻️ RECICLAJES / MATERIALES
# ============================================================

@api_view(['GET'])
def obtener_reciclajes(request):
    """
    Obtener todos los reciclajes registrados en el sistema
    
    Returns:
        Lista de reciclajes con toda su información
    """
    try:
        db = get_db()
        
        if db is None:
            return Response(
                {"error": "No se pudo conectar con la base de datos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        reciclajes = list(db["reciclajes"].find({}))
        
        # Convertir ObjectId a string
        for reciclaje in reciclajes:
            if "_id" in reciclaje:
                reciclaje["_id"] = str(reciclaje["_id"])
        
        return Response(reciclajes, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": f"Error al obtener reciclajes: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def obtener_materiales_usuario(request, usuario_id):
    """
    Obtener materiales reciclados por un usuario específico
    
    Args:
        usuario_id: ID del usuario
        
    Returns:
        Lista de materiales reciclados por ese usuario
    """
    try:
        db = get_db()
        
        if db is None:
            return Response(
                {"error": "No se pudo conectar con la base de datos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        materiales = list(db["reciclajes"].find({"usuario_id": usuario_id}))
        
        # Convertir ObjectId a string
        for mat in materiales:
            if "_id" in mat:
                mat["_id"] = str(mat["_id"])
        
        return Response(materiales, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": f"Error al obtener materiales: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def registrar_material(request):
    """
    Registrar un nuevo material reciclado
    
    Body JSON:
        {
            "tipo": "Plástico",
            "cantidad": 5.5,
            "usuario_id": "507f1f77bcf86cd799439011",
            "punto_recoleccion": "Campus Principal"
        }
        
    Returns:
        Material registrado con EcoCoins calculadas
    """
    try:
        db = get_db()
        
        if db is None:
            return Response(
                {"error": "No se pudo conectar con la base de datos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Extraer datos del request
        tipo = request.data.get("tipo")
        cantidad = request.data.get("cantidad")
        usuario_id = request.data.get("usuario_id")
        punto = request.data.get("punto_recoleccion")
        
        # Validaciones
        if not tipo or not cantidad or not usuario_id:
            return Response(
                {"error": "Faltan campos obligatorios: tipo, cantidad, usuario_id"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cantidad = float(cantidad)
        except (ValueError, TypeError):
            return Response(
                {"error": "La cantidad debe ser un número válido"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar que el usuario existe
        usuario_existe = db["usuarios"].find_one({"_id": ObjectId(usuario_id)})
        if not usuario_existe:
            return Response(
                {"error": "Usuario no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Calcular EcoCoins según el tipo de material
        tarifas = {
            "Plástico": 5,
            "Papel": 3,
            "Vidrio": 7,
            "Metal": 10,
            "Cartón": 4,
            "Electrónico": 15
        }
        
        tarifa = tarifas.get(tipo, 5)  # 5 coins por defecto
        ecocoins = cantidad * tarifa
        
        # Crear documento de material
        material = {
            "tipo": tipo,
            "tipo_material": tipo,  # Alias para compatibilidad
            "cantidad": cantidad,
            "ecocoins_generadas": ecocoins,
            "usuario_id": usuario_id,
            "punto_recoleccion": punto or "No especificado",
            "fecha": datetime.now().isoformat()
        }
        
        # Insertar en la base de datos
        result = db["reciclajes"].insert_one(material)
        material["_id"] = str(result.inserted_id)
        
        # Actualizar EcoCoins del usuario
        db["usuarios"].update_one(
            {"_id": ObjectId(usuario_id)},
            {"$inc": {"ecoCoins": ecocoins}}
        )
        
        print(f"✅ Material registrado: {tipo} - {cantidad}kg - +{ecocoins} EcoCoins")
        
        return Response({
            "mensaje": "Material registrado exitosamente",
            "material": material,
            "ecocoins_ganadas": ecocoins
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"❌ Error al registrar material: {e}")
        return Response(
            {"error": f"Error al registrar material: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ============================================================
# 🎁 RECOMPENSAS
# ============================================================

@api_view(['GET'])
def obtener_recompensas(request):
    """
    Obtener todas las recompensas disponibles
    
    Returns:
        Lista de recompensas con su información
    """
    try:
        db = get_db()
        
        if db is None:
            return Response(
                {"error": "No se pudo conectar con la base de datos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        recompensas = list(db["recompensas"].find({}))
        
        # Convertir ObjectId a string
        for recompensa in recompensas:
            if "_id" in recompensa:
                recompensa["_id"] = str(recompensa["_id"])
        
        return Response(recompensas, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": f"Error al obtener recompensas: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
# ============================================================
# 💳 TRANSACCIONES
# ============================================================

@api_view(['GET'])
def obtener_transacciones(request):
    """
    Obtener historial completo de transacciones (EcoCoins)
    Incluye: depósitos (reciclajes) y canjes (recompensas)
    
    Returns:
        Lista de transacciones ordenadas por fecha descendente
    """
    try:
        db = get_db()
        
        if db is None:
            return Response(
                {"error": "No se pudo conectar con la base de datos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        transacciones = []
        
        # ✅ OBTENER RECICLAJES (Depósitos - Ganados)
        reciclajes = list(db["reciclajes"].find({}))
        for reciclaje in reciclajes:
            transacciones.append({
                "_id": str(reciclaje.get("_id", "")),
                "tipo": "Ganado",
                "usuario_id": str(reciclaje.get("usuario_id", "")),  # ← Convertir a string
                "descripcion": f"Reciclaje de {reciclaje.get('tipo_material', reciclaje.get('tipo', 'material'))}",
                "cantidad": reciclaje.get("ecocoins_generadas", reciclaje.get("ecoCoins_ganadas", 0)),
                "fecha": reciclaje.get("fecha", datetime.now().isoformat()),
                "detalles": {
                    "material": reciclaje.get("tipo_material", reciclaje.get("tipo", "")),
                    "peso_kg": reciclaje.get("cantidad", 0),
                    "punto_recoleccion": reciclaje.get("punto_recoleccion", "")
                }
            })
        
        # ✅ OBTENER CANJES (Recompensas - Canjeados)
        canjes = list(db["canjes"].find({})) if "canjes" in db.list_collection_names() else []
        for canje in canjes:
            transacciones.append({
                "_id": str(canje.get("_id", "")),
                "tipo": "Canjeado",
                "usuario_id": str(canje.get("usuario_id", "")),  # ← Convertir a string
                "descripcion": f"Canje: {canje.get('recompensa_nombre', 'Recompensa')}",
                "cantidad": -abs(canje.get("costo_ecocoins", 0)),
                "fecha": canje.get("fecha", datetime.now().isoformat()),
                "detalles": {
                    "recompensa": canje.get("recompensa_nombre", ""),
                    "estado": canje.get("estado", "completado")
                }
            })
        
        # ✅ ORDENAR POR FECHA (más recientes primero)
        transacciones.sort(key=lambda x: x.get("fecha", ""), reverse=True)
        
        # ✅ ENRIQUECER CON NOMBRES DE USUARIOS (CON VALIDACIÓN)
        for trans in transacciones:
            try:
                usuario_id = trans["usuario_id"]
                
                # Validar que sea un ObjectId válido
                if not usuario_id or len(usuario_id) != 24:
                    trans["usuario_nombre"] = "Usuario desconocido"
                    trans["usuario_correo"] = ""
                    continue
                
                # Buscar usuario
                usuario = db["usuarios"].find_one({"_id": ObjectId(usuario_id)})
                
                if usuario:
                    trans["usuario_nombre"] = usuario.get("nombre", "Usuario desconocido")
                    trans["usuario_correo"] = usuario.get("correo", "")
                else:
                    trans["usuario_nombre"] = "Usuario no encontrado"
                    trans["usuario_correo"] = ""
                    
            except Exception as e:
                # Si hay error con ObjectId, usar valores por defecto
                print(f"⚠️ Error al obtener usuario para transacción {trans.get('_id')}: {e}")
                trans["usuario_nombre"] = "Usuario desconocido"
                trans["usuario_correo"] = ""
        
        print(f"✅ Se encontraron {len(transacciones)} transacciones")
        return Response(transacciones, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"❌ Error en obtener_transacciones: {e}")
        import traceback
        traceback.print_exc()
        return Response(
            {"error": f"Error al obtener transacciones: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def obtener_estadisticas_transacciones(request):
    """
    Obtener resumen de transacciones
    
    Returns:
        - total_generado_hoy
        - total_canjeado_hoy
        - balance_neto_hoy
        - transacciones_hoy
    """
    try:
        db = get_db()
        
        if db is None:
            return Response(
                {"error": "No se pudo conectar con la base de datos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Obtener fecha de hoy
        hoy = datetime.now().date()
        hoy_inicio = datetime.combine(hoy, datetime.min.time())
        hoy_fin = datetime.combine(hoy, datetime.max.time())
        
        # Contar reciclajes de hoy
        reciclajes_hoy = list(db["reciclajes"].find({
            "fecha": {
                "$gte": hoy_inicio.isoformat(),
                "$lte": hoy_fin.isoformat()
            }
        }))
        
        total_generado = sum(r.get("ecocoins_generadas", r.get("ecoCoins_ganadas", 0)) for r in reciclajes_hoy)
        
        # Contar canjes de hoy (si existe la colección)
        canjes_hoy = []
        if "canjes" in db.list_collection_names():
            canjes_hoy = list(db["canjes"].find({
                "fecha": {
                    "$gte": hoy_inicio.isoformat(),
                    "$lte": hoy_fin.isoformat()
                }
            }))
        
        total_canjeado = sum(c.get("costo_ecocoins", 0) for c in canjes_hoy)
        
        estadisticas = {
            "total_generado_hoy": total_generado,
            "total_canjeado_hoy": total_canjeado,
            "balance_neto_hoy": total_generado - total_canjeado,
            "transacciones_hoy": len(reciclajes_hoy) + len(canjes_hoy)
        }
        
        return Response(estadisticas, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"❌ Error en estadisticas_transacciones: {e}")
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ============================================================
# 🔔 NOTIFICACIONES
# ============================================================

@api_view(['GET'])
def obtener_notificaciones(request):
    """
    Obtener todas las notificaciones enviadas
    
    Returns:
        Lista de notificaciones con estadísticas de apertura
    """
    try:
        db = get_db()
        
        if db is None:
            return Response(
                {"error": "No se pudo conectar con la base de datos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Crear colección si no existe
        if "notificaciones" not in db.list_collection_names():
            db.create_collection("notificaciones")
        
        notificaciones = list(db["notificaciones"].find({}))
        
        # Convertir ObjectId a string
        for notif in notificaciones:
            if "_id" in notif:
                notif["_id"] = str(notif["_id"])
        
        # Ordenar por fecha (más recientes primero)
        notificaciones.sort(key=lambda x: x.get("fecha", ""), reverse=True)
        
        print(f"✅ Se encontraron {len(notificaciones)} notificaciones")
        return Response(notificaciones, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"❌ Error en obtener_notificaciones: {e}")
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def crear_notificacion(request):
    """
    Crear y enviar una nueva notificación
    
    Body JSON:
        {
            "titulo": "Título de la notificación",
            "mensaje": "Mensaje completo",
            "destinatarios": "todos" | "activos" | "admin"
        }
    
    Returns:
        Notificación creada con ID
    """
    try:
        db = get_db()
        
        if db is None:
            return Response(
                {"error": "No se pudo conectar con la base de datos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Extraer datos
        titulo = request.data.get("titulo", "").strip()
        mensaje = request.data.get("mensaje", "").strip()
        destinatarios_tipo = request.data.get("destinatarios", "todos").lower()
        
        # Validaciones
        if not titulo or not mensaje:
            return Response(
                {"error": "Título y mensaje son obligatorios"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Contar destinatarios según el tipo
        total_usuarios = db["usuarios"].count_documents({})
        
        if destinatarios_tipo == "activos":
            destinatarios_count = db["usuarios"].count_documents({"estado": "activo"})
        elif destinatarios_tipo == "admin":
            destinatarios_count = db["usuarios"].count_documents({"rol": "admin"})
        else:  # "todos"
            destinatarios_count = total_usuarios
        
        # Crear notificación
        notificacion = {
            "titulo": titulo,
            "mensaje": mensaje,
            "destinatarios_tipo": destinatarios_tipo,
            "destinatarios_count": destinatarios_count,
            "fecha": datetime.now().isoformat(),
            "estado": "Enviado",
            "abiertos": 0,
            "tasa_apertura": 0
        }
        
        # Insertar en BD
        result = db["notificaciones"].insert_one(notificacion)
        notificacion["_id"] = str(result.inserted_id)
        
        print(f"✅ Notificación creada: {titulo}")
        
        return Response({
            "mensaje": "Notificación enviada exitosamente",
            "notificacion": notificacion
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"❌ Error en crear_notificacion: {e}")
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def obtener_estadisticas_notificaciones(request):
    """
    Obtener estadísticas de notificaciones
    
    Returns:
        - total_enviadas_mes
        - tasa_apertura_promedio
    """
    try:
        db = get_db()
        
        if db is None:
            return Response(
                {"error": "No se pudo conectar con la base de datos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Contar notificaciones del mes actual
        from datetime import datetime, timedelta
        inicio_mes = datetime.now().replace(day=1, hour=0, minute=0, second=0)
        
        notificaciones_mes = list(db["notificaciones"].find({
            "fecha": {"$gte": inicio_mes.isoformat()}
        }))
        
        # Calcular tasa de apertura promedio
        if notificaciones_mes:
            tasa_promedio = sum(n.get("tasa_apertura", 0) for n in notificaciones_mes) / len(notificaciones_mes)
        else:
            tasa_promedio = 0
        
        estadisticas = {
            "total_enviadas_mes": len(notificaciones_mes),
            "tasa_apertura_promedio": round(tasa_promedio, 1)
        }
        
        return Response(estadisticas, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return Response({"error": str(e)}, status=500)