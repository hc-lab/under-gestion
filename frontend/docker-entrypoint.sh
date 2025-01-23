#!/bin/sh
set -e

# Configurar el puerto para nginx
export NGINX_PORT=${PORT:-8080}
echo "Configurando NGINX para escuchar en puerto: $NGINX_PORT"

# Generar la configuración de nginx desde el template
envsubst '${NGINX_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Reemplazar la variable de entorno en los archivos estáticos si existe
if [ ! -z "$VITE_API_URL" ]; then
    echo "Configurando VITE_API_URL: $VITE_API_URL"
    find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" {} +
fi

# Verificar la configuración
echo "Verificando configuración de nginx..."
nginx -t

# Iniciar nginx
exec nginx -g 'daemon off;'
