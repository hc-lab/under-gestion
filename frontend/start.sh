#!/bin/sh
set -e

# Configurar el puerto si no está definido
export PORT=${PORT:-8080}
echo "Puerto configurado: $PORT"

# Reemplazar el puerto en la configuración de nginx
sed -i "s/listen 8080/listen $PORT/" /etc/nginx/nginx.conf

# Verificar la configuración
nginx -t

# Iniciar nginx
exec nginx -g "daemon off;"
