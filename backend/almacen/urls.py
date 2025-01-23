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


def serve_frontend(request):
    if request.headers.get('Host') == 'healthcheck.railway.app':
        return HttpResponse("OK")
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
    # Servir archivos estáticos
    re_path(r'^static/(?P<path>.*)$', RedirectView.as_view(url='/static/%(path)s')),
    # Servir el frontend por defecto para todas las rutas no encontradas
    re_path(r'^.*$', serve_frontend, name='frontend'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    path('favicon.ico', RedirectView.as_view(
        url=settings.STATIC_URL + 'favicon.ico'))
]
