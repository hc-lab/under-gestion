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
import os
import mimetypes

def serve_static_file(request, file_path, content_type=None):
    """Sirve un archivo estático con el tipo MIME correcto."""
    if not os.path.exists(file_path):
        return HttpResponse(status=404)
        
    if content_type is None:
        content_type, _ = mimetypes.guess_type(file_path)
        if content_type is None:
            content_type = 'application/octet-stream'
            
    response = FileResponse(open(file_path, 'rb'), content_type=content_type)
    response['Content-Type'] = content_type
    return response

def serve_frontend(request, path=''):
    """Sirve el frontend y los archivos estáticos."""
    if request.headers.get('Host') == 'healthcheck.railway.app':
        return HttpResponse("OK")
    
    # Ruta base del frontend
    frontend_dir = os.path.join(settings.BASE_DIR, '..', 'frontend', 'build')
    
    # Si es un archivo estático, servirlo con el tipo MIME correcto
    if path.startswith('static/'):
        file_path = os.path.join(frontend_dir, path)
        if path.endswith('.js'):
            return serve_static_file(request, file_path, 'application/javascript')
        elif path.endswith('.css'):
            return serve_static_file(request, file_path, 'text/css')
        else:
            return serve_static_file(request, file_path)
    
    # Para cualquier otra ruta, servir index.html
    index_path = os.path.join(frontend_dir, 'index.html')
    return serve_static_file(request, index_path, 'text/html')

# Configurar tipos MIME adicionales
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("image/x-icon", ".ico")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('productos.urls')),
    path('api/personales/', include('personales.urls')),
    
    # Servir archivos en la raíz con tipos MIME específicos
    path('favicon.ico', lambda r: serve_static_file(r, os.path.join(settings.BASE_DIR, '..', 'frontend', 'build', 'favicon.ico'), 'image/x-icon')),
    path('logo192.png', lambda r: serve_static_file(r, os.path.join(settings.BASE_DIR, '..', 'frontend', 'build', 'logo192.png'), 'image/png')),
    path('logo512.png', lambda r: serve_static_file(r, os.path.join(settings.BASE_DIR, '..', 'frontend', 'build', 'logo512.png'), 'image/png')),
    path('manifest.json', lambda r: serve_static_file(r, os.path.join(settings.BASE_DIR, '..', 'frontend', 'build', 'manifest.json'), 'application/json')),
    path('robots.txt', lambda r: serve_static_file(r, os.path.join(settings.BASE_DIR, '..', 'frontend', 'build', 'robots.txt'), 'text/plain')),
    
    # Servir el frontend y archivos estáticos
    re_path(r'^(?P<path>.*)$', serve_frontend),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
