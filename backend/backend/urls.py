from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # Serve frontend's index.html for all other routes
    re_path(r'^.*', TemplateView.as_view(template_name='frontend/index.html')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
