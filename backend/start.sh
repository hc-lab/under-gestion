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

# Asegurarse de que los directorios necesarios existan y tengan los permisos correctos
echo "Configurando permisos..."
mkdir -p /run/nginx
mkdir -p /var/log/nginx
chown -R www-data:www-data /var/www/html /run/nginx /var/log/nginx
chmod -R 755 /var/www/html

# Verificar la configuración de nginx
echo "Verificando configuración de nginx..."
nginx -t || (echo "Error en la configuración de nginx" && cat /etc/nginx/nginx.conf && exit 1)

# Iniciar nginx
echo "Iniciando nginx..."
nginx || (echo "Error al iniciar nginx" && cat /var/log/nginx/error.log && exit 1)

echo "Iniciando Gunicorn..."
# Iniciar Gunicorn
exec gunicorn almacen.wsgi:application \
    --log-file - \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --preload
