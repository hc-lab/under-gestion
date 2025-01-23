#!/bin/sh
set -e

# Reemplazar la variable de entorno en los archivos estáticos si existe
if [ ! -z "$VITE_API_URL" ]; then
    echo "Configurando VITE_API_URL: $VITE_API_URL"
    find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" {} +
fi

# Verificar permisos
chown -R nginx:nginx /usr/share/nginx/html
chmod -R 755 /usr/share/nginx/html

# Iniciar nginx
exec nginx -g 'daemon off;'
