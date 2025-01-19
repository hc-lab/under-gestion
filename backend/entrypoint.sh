#!/bin/sh

# Esperar por PostgreSQL
ATTEMPTS=0
MAX_ATTEMPTS=60
echo "Waiting for PostgreSQL..."
until nc -z -v -w30 $POSTGRES_HOST $POSTGRES_PORT || [ $ATTEMPTS -ge $MAX_ATTEMPTS ]; do
    sleep 1
    ATTEMPTS=$((ATTEMPTS + 1))
done

if [ $ATTEMPTS -ge $MAX_ATTEMPTS ]; then
    echo "PostgreSQL not started within the expected time"
    exit 1
fi

echo "PostgreSQL started"

# Crear directorios de migraciones si no existen
mkdir -p /app/backend/personales/migrations
mkdir -p /app/backend/productos/migrations
touch /app/backend/personales/migrations/__init__.py
touch /app/backend/productos/migrations/__init__.py

# Generar y aplicar migraciones
echo "Generando migraciones..."
python manage.py makemigrations personales productos

echo "Aplicando migraciones..."
python manage.py migrate --noinput

# Crear superusuario y su perfil
USERNAME=${DJANGO_SUPERUSER_USERNAME:-admin}
EMAIL=${DJANGO_SUPERUSER_EMAIL:-admin@example.com}
PASSWORD=${DJANGO_SUPERUSER_PASSWORD:-admin123}

echo "Creando superusuario y perfil..."
python manage.py shell << END
from django.contrib.auth.models import User
from personales.models import Perfil

try:
    user = User.objects.get(username='$USERNAME')
except User.DoesNotExist:
    user = User.objects.create_superuser('$USERNAME', '$EMAIL', '$PASSWORD')

Perfil.objects.get_or_create(
    user=user,
    defaults={
        'rol': 'ADMIN',
        'area': 'Administración'
    }
)

# Crear perfil para usuarios existentes
for user in User.objects.all():
    Perfil.objects.get_or_create(
        user=user,
        defaults={
            'rol': 'ADMIN' if user.is_superuser else 'OPERADOR',
            'area': 'General'
        }
    )
END

# Configurar cronjobs
echo "Configurando cronjobs..."
python manage.py crontab remove  # Eliminar cron jobs existentes
python manage.py crontab add     # Añadir cron jobs nuevos

# Ejecutar el comando principal del contenedor
exec "$@"
