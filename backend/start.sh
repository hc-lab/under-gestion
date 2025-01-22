#!/bin/sh

# Cambiar al directorio del backend
cd /app/backend

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario si no existe
python manage.py createsuperuser --noinput || echo "Superuser already exists"

# Iniciar nginx
service nginx start

# Iniciar Gunicorn
exec gunicorn almacen.wsgi:application \
    --log-file - \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --preload
