#!/bin/sh
set -e

# Set default port
PORT="${PORT:-8080}"
echo "Puerto configurado: $PORT"

# Update nginx configuration
sed -i "s/listen 80/listen $PORT/" /etc/nginx/nginx.conf

echo "Configuración de nginx:"
cat /etc/nginx/nginx.conf

echo "Iniciando nginx..."
exec nginx -g "daemon off;"
