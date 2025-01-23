#!/bin/sh
set -e

# Configurar el puerto si no está definido
export PORT=${PORT:-8080}
echo "Puerto configurado: $PORT"

# Generar la configuración de nginx
cp /app/frontend/nginx.conf.template /etc/nginx/nginx.conf
sed -i "s/NGINX_PORT/$PORT/" /etc/nginx/nginx.conf

# Verificar la configuración
nginx -t

# Iniciar nginx
exec nginx -g "daemon off;"
