#!/bin/bash
set -e

echo "Iniciando servicios..."

# Cambiar al directorio del backend
cd /app/backend
#cd

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
mkdir -p /var/lib/nginx/body
mkdir -p /var/lib/nginx/fastcgi
mkdir -p /var/lib/nginx/proxy
mkdir -p /var/lib/nginx/scgi
mkdir -p /var/lib/nginx/uwsgi

# Configurar permisos
chown -R www-data:www-data /var/www/html /run/nginx /var/log/nginx /var/lib/nginx
chmod -R 755 /var/www/html /var/lib/nginx

# Limpiar archivos antiguos de nginx
rm -f /run/nginx.pid
rm -f /run/nginx/nginx.pid

# Verificar la configuración de nginx
echo "Verificando configuración de nginx..."
nginx -t || (echo "Error en la configuración de nginx" && cat /etc/nginx/nginx.conf && exit 1)

# Iniciar nginx en primer plano
echo "Iniciando nginx..."
nginx

# Esperar un momento para asegurarse de que nginx haya iniciado
sleep 2

# Verificar que nginx esté corriendo
if ! ps aux | grep -q '[n]ginx: master process'; then
    echo "Error: nginx no se pudo iniciar"
    cat /var/log/nginx/error.log
    exit 1
fi

echo "Iniciando Gunicorn..."
# Iniciar Gunicorn
exec gunicorn almacen.wsgi:application \
    --log-file - \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --preload
