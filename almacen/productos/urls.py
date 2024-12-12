from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet, 
    HistorialProductoViewSet, 
    SalidaProductoViewSet, 
    HistorialViewSet, 
    CustomAuthToken,
    CategoriaViewSet,
    NoticiaViewSet
)


router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'historial', HistorialViewSet, basename='historial')
router.register(r'historial-producto', HistorialProductoViewSet, basename='historialproducto')
router.register(r'salidas', SalidaProductoViewSet, basename='salidaproducto')
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'noticias', NoticiaViewSet, basename='noticia')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/', CustomAuthToken.as_view(), name='auth_token'),  # Cambiado a auth/token/
]