#!/bin/bash

set -e  # Exit on error

echo "Starting deployment process..."

# Esperar a que la base de datos esté lista
echo "Waiting for database..."
sleep 10

# Aplicar migraciones
echo "Applying database migrations..."
python manage.py migrate --noinput

# Recolectar archivos estáticos
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Crear directorio static si no existe
mkdir -p /app/backend/static

# Iniciar Gunicorn
echo "Starting Gunicorn..."
exec gunicorn almacen.wsgi:application \
    --bind 0.0.0.0:8080 \
    --workers 4 \
    --worker-class gthread \
    --threads 4 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    --log-level debug
