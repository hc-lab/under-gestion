#!/bin/bash
set -e

# Obtener el puerto del entorno o usar 8080 por defecto
export NGINX_PORT="${PORT:-8080}"
echo "Puerto configurado: $NGINX_PORT"

# Verificar que los archivos del frontend existen
echo "Verificando archivos del frontend..."
if [ ! -f "/app/frontend/build/index.html" ]; then
    echo "Error: No se encuentra /app/frontend/build/index.html"
    ls -la /app/frontend/build/
    exit 1
fi

echo "Verificando archivos estáticos..."
if [ ! -d "/app/frontend/build/static" ]; then
    echo "Error: No se encuentra el directorio /app/frontend/build/static"
    exit 1
fi

ls -la /app/frontend/build/static/

# Asegurar que los directorios necesarios existan y tengan los permisos correctos
echo "Configurando permisos..."
mkdir -p /run/nginx
mkdir -p /var/log/nginx
mkdir -p /var/lib/nginx/body
mkdir -p /var/lib/nginx/fastcgi
mkdir -p /var/lib/nginx/proxy
mkdir -p /var/lib/nginx/scgi
mkdir -p /var/lib/nginx/uwsgi

# Configurar permisos
chown -R nginx:nginx /app/frontend/build
chmod -R 755 /app/frontend/build
chown -R nginx:nginx /var/cache/nginx
chown -R nginx:nginx /var/log/nginx
chown -R nginx:nginx /etc/nginx
chown -R nginx:nginx /var/lib/nginx
chown -R nginx:nginx /run/nginx

# Reemplazar variables en la configuración de nginx
echo "Configurando nginx..."
envsubst '$NGINX_PORT' < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf.tmp
mv /etc/nginx/nginx.conf.tmp /etc/nginx/nginx.conf

# Verificar la configuración de nginx
echo "Verificando configuración de nginx..."
nginx -t || (echo "Error en la configuración de nginx" && cat /etc/nginx/nginx.conf && exit 1)

# Mostrar la configuración final
echo "Configuración final de nginx:"
cat /etc/nginx/nginx.conf

# Iniciar nginx
echo "Iniciando nginx..."
nginx -g "daemon off;"
