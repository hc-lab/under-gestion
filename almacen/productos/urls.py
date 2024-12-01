from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, HistorialProductoViewSet, SalidaProductoViewSet

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'historial', HistorialProductoViewSet, basename='historialproducto')
router.register(r'salidas', SalidaProductoViewSet, basename='salidaproducto')

urlpatterns = [
    path('', include(router.urls)),
]
