from django.urls import path
from . import views

urlpatterns = [
    path('usuarios/', views.obtener_usuarios),
    path('reciclajes/', views.obtener_reciclajes),
    path('recompensas/', views.obtener_recompensas),
    path('estadisticas/', views.obtener_estadisticas),
]
