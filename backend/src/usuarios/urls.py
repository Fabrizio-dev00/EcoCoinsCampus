from django.urls import path
from . import views

urlpatterns = [
    path('registrar/', views.registrar_usuario, name='registrar_usuario'),
    path('login_admin/', views.login_admin, name='login_admin'),

    # Gestión usuarios
    path('listar/', views.listar_usuarios, name='listar_usuarios'),
    path('estado/', views.cambiar_estado_usuario, name='cambiar_estado_usuario'),
    path('rol/', views.alternar_rol_usuario, name='alternar_rol_usuario'),
    path('eliminar/', views.eliminar_usuario, name='eliminar_usuario'),
]
