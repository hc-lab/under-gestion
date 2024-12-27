#!/bin/sh

echo "Waiting for postgres..."
while ! nc -z db 5432; do
    sleep 0.1
done
echo "PostgreSQL started"

# Crear directorios de migraciones si no existen
mkdir -p /app/backend/personales/migrations
mkdir -p /app/backend/productos/migrations
touch /app/backend/personales/migrations/__init__.py
touch /app/backend/productos/migrations/__init__.py

# Generar y aplicar migraciones
python manage.py makemigrations personales
python manage.py makemigrations productos
python manage.py migrate

# Crear superusuario y su perfil
python manage.py shell << END
from django.contrib.auth.models import User
from personales.models import Perfil

# Crear o actualizar superusuario
try:
    user = User.objects.get(username='admin')
except User.DoesNotExist:
    user = User.objects.create_superuser('admin', 'admin@example.com', 'admin123')

# Asegurar que el perfil existe
Perfil.objects.get_or_create(
    user=user,
    defaults={
        'rol': 'ADMIN',
        'area': 'Administración'
    }
)

# Crear perfil para usuario existente si es necesario
for user in User.objects.all():
    Perfil.objects.get_or_create(
        user=user,
        defaults={
            'rol': 'ADMIN' if user.is_superuser else 'OPERADOR',
            'area': 'General'
        }
    )
END

exec "$@" 