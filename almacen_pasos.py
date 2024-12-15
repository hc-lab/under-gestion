django-admin startproject almacen
cd almacen
django-admin startapp productos


python -m venv path/to/venv
source path/to/venv/bin/activate


sudo pacman -S python python-pip
pip install django psycopg2
#pip install django psycopg2-binary
pip install django-cors-headers




Configurar Django para usar PostgreSQL: Edita almacen_project/settings.py:

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'almacen',
        'USER': 'almacen_user',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '',
    }
}



sudo pacman -S nodejs npm



Paso 2: Configuración del Backend (Django)

    Modelos de Productos: Edita productos/models.py:

    from django.db import models

    class Producto(models.Model):
        nombre = models.CharField(max_length=100)
        stock = models.IntegerField()

        def __str__(self):
            return self.nombre




Serializadores: Crea productos/serializers.py:

from rest_framework import serializers
from .models import Producto

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'



Vistas: Edita productos/views.py:

from rest_framework import viewsets
from .models import Producto
from .serializers import ProductoSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer



URLs: crea productos/urls.py:

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]


Edita almacen_project/urls.py:

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('productos.urls')),
]


Registrar el Modelo en Admin: Asegúrate de que el modelo Producto esté registrado en la interfaz de administración. Edita productos/admin.py

from django.contrib import admin
from .models import Producto

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'stock')




antes añadir esto en INSTALLED_APPS en settings.py

    'rest_framework',
    'productos',
    'corsheaders',


MIDDLEWARE = [
    ...
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]



############################
############################


Migraciones y Superusuario y otros:



pip install djangorestframework
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser




