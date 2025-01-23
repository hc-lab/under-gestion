#!/bin/bash

# Reemplazar la variable de entorno en el archivo de configuración si existe
if [ ! -z "$VITE_API_URL" ]; then
    echo "Configurando VITE_API_URL: $VITE_API_URL"
    find /usr/share/nginx/html -type f -exec sed -i "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" {} +
fi

# Iniciar nginx
nginx -g 'daemon off;'
