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

# Recolectar archivos estáticos
echo "Recolectando archivos estáticos..."
python manage.py collectstatic --noinput

# Crear superusuario si no existe
echo "Creando superusuario..."
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username="$DJANGO_SUPERUSER_USERNAME").exists():
    User.objects.create_superuser("$DJANGO_SUPERUSER_USERNAME", "$DJANGO_SUPERUSER_EMAIL", "$DJANGO_SUPERUSER_PASSWORD")
    print("Superusuario creado exitosamente")
else:
    print("El superusuario ya existe")
END

# Configurar cronjobs
echo "Configurando cronjobs..."
python manage.py crontab remove  # Eliminar cron jobs existentes
python manage.py crontab add     # Añadir cron jobs nuevos

# Ejecutar gunicorn
echo "Iniciando Gunicorn..."
exec gunicorn almacen.wsgi:application --bind 0.0.0.0:$PORT