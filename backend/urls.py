from django.urls import path, include

urlpatterns = [
    path('api/auth/', include('authentication.urls')),
    path('api/personal/', include('personal.urls')),  # Verificar nombre correcto
    path('api/tareos/', include('tareos.urls')),
    path('api/productos/', include('productos.urls')),
    path('api/dashboard-data/', include('dashboard.urls')),
]
