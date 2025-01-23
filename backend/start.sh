#!/bin/bash
set -e

echo "Iniciando servicios..."

# Obtener el puerto del entorno o usar 8000 por defecto
export NGINX_PORT="${PORT:-8000}"
echo "Puerto configurado: $NGINX_PORT"

# Calcular el puerto para Gunicorn (usar un puerto diferente al de nginx)
export GUNICORN_PORT=$((NGINX_PORT + 1))
echo "Puerto de Gunicorn: $GUNICORN_PORT"

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

# Reemplazar variables en la configuración de nginx
envsubst '$NGINX_PORT $GUNICORN_PORT' < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf.tmp
mv /etc/nginx/nginx.conf.tmp /etc/nginx/nginx.conf

# Verificar la configuración de nginx
echo "Verificando configuración de nginx..."
nginx -t || (echo "Error en la configuración de nginx" && cat /etc/nginx/nginx.conf && exit 1)

# Iniciar nginx
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
# Iniciar Gunicorn con el nuevo puerto
exec gunicorn almacen.wsgi:application \
    --log-file - \
    --bind "0.0.0.0:${GUNICORN_PORT}" \
    --workers 3 \
    --timeout 120 \
    --preload
