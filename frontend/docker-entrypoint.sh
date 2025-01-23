#!/bin/sh
set -e

echo "Verificando contenido del directorio HTML..."
ls -la /usr/share/nginx/html/

# Reemplazar la variable de entorno en los archivos estáticos si existe
if [ ! -z "$VITE_API_URL" ]; then
    echo "Configurando VITE_API_URL: $VITE_API_URL"
    find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" {} +
fi

# Verificar permisos
echo "Configurando permisos..."
chown -R nginx:nginx /usr/share/nginx/html
chmod -R 755 /usr/share/nginx/html

echo "Verificando permisos finales..."
ls -la /usr/share/nginx/html/

# Iniciar nginx
echo "Iniciando nginx..."
exec nginx -g 'daemon off;'
