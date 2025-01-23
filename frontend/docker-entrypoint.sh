#!/bin/bash

# Reemplazar variables de entorno en la configuración de nginx
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Reemplazar la variable de entorno en los archivos estáticos si existe
if [ ! -z "$VITE_API_URL" ]; then
    echo "Configurando VITE_API_URL: $VITE_API_URL"
    find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" {} +
fi

# Verificar que nginx.conf es válido
nginx -t

# Iniciar nginx
exec nginx -g 'daemon off;'
