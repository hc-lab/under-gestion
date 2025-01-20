#!/bin/sh

# Esperar por PostgreSQL
ATTEMPTS=0
MAX_ATTEMPTS=60
echo "Esperando a que PostgreSQL esté disponible..."
until nc -z -v -w30 $POSTGRES_HOST $POSTGRES_PORT || [ $ATTEMPTS -ge $MAX_ATTEMPTS ]; do
    sleep 1
    ATTEMPTS=$((ATTEMPTS + 1))
done

if [ $ATTEMPTS -ge $MAX_ATTEMPTS ]; then
    echo "PostgreSQL no inició dentro del tiempo esperado"
    exit 1
fi

echo "PostgreSQL iniciado"

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

# Crear superusuario si no existe
USERNAME=${DJANGO_SUPERUSER_USERNAME:-hitt}
EMAIL=${DJANGO_SUPERUSER_EMAIL:-admin@example.com}
PASSWORD=${DJANGO_SUPERUSER_PASSWORD:-1234}

echo "Verificando si el superusuario existe..."
python manage.py shell << END
from django.contrib.auth.models import User

# Verifica si el superusuario ya existe
if not User.objects.filter(username='$USERNAME').exists():
    print("Creando superusuario...")
    User.objects.create_superuser('$USERNAME', '$EMAIL', '$PASSWORD')
else:
    print("El superusuario ya existe.")
END

# Configurar cronjobs
echo "Configurando cronjobs..."
python manage.py crontab remove  # Eliminar cron jobs existentes
python manage.py crontab add     # Añadir cron jobs nuevos

# Ejecutar el servidor de Django
echo "Iniciando el servidor de Django..."
exec python manage.py runserver 0.0.0.0:8000