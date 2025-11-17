from rest_framework.decorators import api_view
from rest_framework.response import Response
from mongo_connection import get_db

@api_view(['GET'])
def obtener_materiales_usuario(request, usuario_id):
    """Materiales de un usuario específico"""
    db = get_db()
    materiales = list(db["reciclajes"].find({"usuario_id": usuario_id}))
    
    # Convertir ObjectId a string
    for mat in materiales:
        mat["_id"] = str(mat["_id"])
    
    return Response(materiales)

@api_view(['POST'])
def registrar_material(request):
    """Registrar nuevo material reciclado"""
    db = get_db()
    
    tipo = request.data.get("tipo")
    cantidad = request.data.get("cantidad")
    usuario_id = request.data.get("usuario_id")
    punto = request.data.get("punto_recoleccion")
    
    # Calcular ecocoins (ejemplo: 5 coins por kg)
    ecocoins = cantidad * 5
    
    material = {
        "tipo": tipo,
        "cantidad": cantidad,
        "ecocoins_generadas": ecocoins,
        "usuario_id": usuario_id,
        "punto_recoleccion": punto,
        "fecha": datetime.now().isoformat()
    }
    
    result = db["reciclajes"].insert_one(material)
    material["_id"] = str(result.inserted_id)
    
    # Actualizar ecoCoins del usuario
    db["usuarios"].update_one(
        {"_id": usuario_id},
        {"$inc": {"ecoCoins": ecocoins}}
    )
    
    return Response({
        "mensaje": "Material registrado",
        "material": material
    }, status=201)

@api_view(['GET'])
def obtener_usuarios(request):
    db = get_db()
    usuarios = list(db["usuarios"].find({}, {
        "_id": 0,
        "nombre": 1,
        "correo": 1,
        "rol": 1,
        "ecoCoins": 1,
        "estado": 1
    }))
    return Response(usuarios)

@api_view(['GET'])
def obtener_reciclajes(request):
    db = get_db()
    reciclajes = list(db["reciclajes"].find({}, {"_id": 0}))
    return Response(reciclajes)

@api_view(['GET'])
def obtener_recompensas(request):
    db = get_db()
    recompensas = list(db["recompensas"].find({}, {"_id": 0}))
    return Response(recompensas)

# ===============================================================
# 📊 ESTADÍSTICAS DETALLADAS PARA EL PANEL
# ===============================================================
@api_view(['GET'])
def obtener_estadisticas(request):
    db = get_db()

    # Conteos globales
    usuarios_total = db["usuarios"].count_documents({})
    reciclajes_total = db["reciclajes"].count_documents({})
    ecoCoins_total = sum(u.get("ecoCoins", 0) for u in db["usuarios"].find({}))

    # Usuarios activos vs suspendidos
    activos = db["usuarios"].count_documents({"estado": "activo"})
    suspendidos = db["usuarios"].count_documents({"estado": "suspendido"})

    # Materiales más reciclados
    pipeline = [
        {"$group": {"_id": "$tipo_material", "cantidad": {"$sum": 1}}},
        {"$sort": {"cantidad": -1}},
        {"$limit": 5}
    ]
    materiales = list(db["reciclajes"].aggregate(pipeline))
    materiales = [
        {"tipo_material": m["_id"] if m["_id"] else "Desconocido", "cantidad": m["cantidad"]}
        for m in materiales
    ]

    # Respuesta final
    estadisticas = {
        "total_usuarios": usuarios_total,
        "activos": activos,
        "suspendidos": suspendidos,
        "total_reciclajes": reciclajes_total,
        "materiales": materiales,
        "total_ecoCoins_generadas": ecoCoins_total
    }

    return Response(estadisticas)
