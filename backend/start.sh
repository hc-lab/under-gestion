#!/bin/bash
set -e

echo "Iniciando servicios..."

# Cambiar al directorio del backend
cd /app/backend

# Ejecutar migraciones
echo "Aplicando migraciones..."
python manage.py migrate --noinput

# Recolectar archivos estáticos
echo "Recolectando archivos estáticos..."
python manage.py collectstatic --noinput

# Crear superusuario si no existe (ignorar error si ya existe)
echo "Verificando superusuario..."
python manage.py createsuperuser --noinput || true

# Asegurarse de que los directorios necesarios existan
mkdir -p /run/nginx
chown -R www-data:www-data /var/www/html /run/nginx

# Asegurarse de que nginx.conf sea válido
echo "Verificando configuración de nginx..."
nginx -t

# Iniciar nginx en segundo plano
echo "Iniciando nginx..."
service nginx start || (echo "Error al iniciar nginx" && exit 1)

echo "Iniciando Gunicorn..."
# Iniciar Gunicorn
exec gunicorn almacen.wsgi:application \
    --log-file - \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --preload
