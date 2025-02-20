from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import (
    ProductoViewSet,
    SalidaProductoViewSet,
    CategoriaViewSet,
    NoticiaViewSet,
    IngresoProductoViewSet,
    DashboardDataView,
    SalidaProductoDataView,
)

router = routers.DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'salidas', SalidaProductoViewSet, basename='salidaproducto')
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'noticias', NoticiaViewSet, basename='noticia')
router.register(r'ingresos', IngresoProductoViewSet, basename='ingreso')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('dashboard-data/', DashboardDataView.as_view(), name='dashboard-data'),
    path('salida-producto-data/<int:producto_id>/',
         SalidaProductoDataView.as_view(), name='salida-producto-data'),
    path('ingresos-dia/',
         IngresoProductoViewSet.as_view({'get': 'list'}), name='ingresos-dia'),
]
