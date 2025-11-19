from django.urls import path
from . import views

urlpatterns = [
    # Estadísticas
    path('estadisticas/', views.obtener_estadisticas, name='estadisticas'),
    
    # Usuarios
    path('usuarios/', views.obtener_usuarios, name='usuarios'),
    
    # Reciclajes
    path('reciclajes/', views.obtener_reciclajes, name='reciclajes'),
    path('materiales/usuario/<str:usuario_id>/', views.obtener_materiales_usuario, name='materiales_usuario'),
    path('materiales/registrar/', views.registrar_material, name='registrar_material'),
    
    # Recompensas
    path('recompensas/', views.obtener_recompensas, name='recompensas'),

    # ============================================
    # 💳 TRANSACCIONES (NUEVO)
    # ============================================
    path('transacciones/', views.obtener_transacciones, name='transacciones'),
    path('transacciones/estadisticas/', views.obtener_estadisticas_transacciones, name='estadisticas_transacciones'),
    
    # ============================================
    # 🔔 NOTIFICACIONES (NUEVO)
    # ============================================
    path('notificaciones/', views.obtener_notificaciones, name='notificaciones'),
    path('notificaciones/crear/', views.crear_notificacion, name='crear_notificacion'),
    path('notificaciones/estadisticas/', views.obtener_estadisticas_notificaciones, name='estadisticas_notificaciones'),
]
