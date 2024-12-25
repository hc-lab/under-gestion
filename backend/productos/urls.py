from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet, 
    HistorialProductoViewSet, 
    SalidaProductoViewSet, 
    HistorialViewSet, 
    CustomAuthToken,
    CategoriaViewSet,
    NoticiaViewSet,
    IngresoProductoViewSet,
    DashboardDataView,
    SalidaProductoDataView,
    get_user_data,
)

router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'historial', HistorialViewSet, basename='historial')
router.register(r'historial-producto', HistorialProductoViewSet, basename='historial-producto')
router.register(r'salidas', SalidaProductoViewSet, basename='salidaproducto')
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'noticias', NoticiaViewSet, basename='noticia')
router.register(r'ingresos', IngresoProductoViewSet, basename='ingreso')
router.register(r'ingresos-dia', IngresoProductoViewSet, basename='ingreso-dia')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', CustomAuthToken.as_view(), name='api_token_auth'),
    path('user/current/', get_user_data, name='get_user_data'),
    path('dashboard-data/', DashboardDataView.as_view(), name='dashboard-data'),
    path('salida-producto-data/<int:producto_id>/', SalidaProductoDataView.as_view(), name='salida-producto-data'),
    path('ingresos-dia/', IngresoProductoViewSet.as_view({'get': 'list'}), name='ingresos-dia'),
    path('salidas/', SalidaProductoViewSet.as_view({'get': 'list'}), name='salidas'),
    path('historial-producto/', HistorialProductoViewSet.as_view({'get': 'list'}), name='historial-producto'),
]