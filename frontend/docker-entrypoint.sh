#!/bin/sh
set -e

# Set default port
PORT="${PORT:-8080}"
echo "Puerto configurado: $PORT"

# Verify files
echo "Verificando archivos en /usr/share/nginx/html:"
ls -la /usr/share/nginx/html/

# Update nginx configuration
sed -i "s/listen 80/listen $PORT/" /etc/nginx/nginx.conf

echo "Configuración de nginx:"
cat /etc/nginx/nginx.conf

echo "Verificando index.html:"
cat /usr/share/nginx/html/index.html

echo "Iniciando nginx..."
exec nginx -g "daemon off;"
