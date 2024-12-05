from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, HistorialProductoViewSet, SalidaProductoViewSet, HistorialViewSet, CustomAuthToken

router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'historial', HistorialViewSet, basename='historial')
router.register(r'historial-producto', HistorialProductoViewSet, basename='historialproducto')
router.register(r'salidas', SalidaProductoViewSet, basename='salidaproducto')

urlpatterns = [
    path('', include(router.urls)),
    path('api/login/', CustomAuthToken.as_view()),
]