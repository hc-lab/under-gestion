"""
URL configuration for almacen project.
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.views.generic import RedirectView
from django.http import HttpResponse, FileResponse
from django.views.static import serve
import os


def serve_frontend(request, path=''):
    if request.headers.get('Host') == 'healthcheck.railway.app':
        return HttpResponse("OK")
        
    # Si es un archivo estático, servirlo desde el directorio correcto
    if path.startswith('static/'):
        file_path = os.path.join(settings.BASE_DIR, '..', 'frontend', 'build', path)
        if os.path.exists(file_path):
            return FileResponse(open(file_path, 'rb'))
    
    # Para cualquier otra ruta, servir index.html
    try:
        index_file = open(os.path.join(settings.BASE_DIR, '..', 'frontend', 'build', 'index.html'), 'rb')
        return FileResponse(index_file)
    except FileNotFoundError:
        return HttpResponse("Frontend not found", status=404)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('productos.urls')),
    path('api/personales/', include('personales.urls')),
    # Servir archivos estáticos directamente
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': os.path.join(settings.BASE_DIR, '..', 'frontend', 'build', 'static')}),
    # Servir archivos en la raíz
    path('favicon.ico', serve, {'document_root': os.path.join(settings.BASE_DIR, '..', 'frontend', 'build'), 'path': 'favicon.ico'}),
    path('logo192.png', serve, {'document_root': os.path.join(settings.BASE_DIR, '..', 'frontend', 'build'), 'path': 'logo192.png'}),
    path('logo512.png', serve, {'document_root': os.path.join(settings.BASE_DIR, '..', 'frontend', 'build'), 'path': 'logo512.png'}),
    path('manifest.json', serve, {'document_root': os.path.join(settings.BASE_DIR, '..', 'frontend', 'build'), 'path': 'manifest.json'}),
    path('robots.txt', serve, {'document_root': os.path.join(settings.BASE_DIR, '..', 'frontend', 'build'), 'path': 'robots.txt'}),
    # Servir el frontend por defecto para todas las rutas no encontradas
    re_path(r'^(?P<path>.*)$', serve_frontend),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
