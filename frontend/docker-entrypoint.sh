#!/bin/bash
set -e

# Asegurarse de que PORT está definido
if [ -z "$PORT" ]; then
    export PORT=80
fi

echo "Configurando puerto: $PORT"

# Reemplazar la variable PORT en la configuración de nginx
sed -i "s/listen PORT/listen $PORT/g" /etc/nginx/nginx.conf

# Reemplazar la variable de entorno en los archivos estáticos si existe
if [ ! -z "$VITE_API_URL" ]; then
    echo "Configurando VITE_API_URL: $VITE_API_URL"
    find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" {} +
fi

# Verificar que los directorios necesarios tienen permisos correctos
for dir in "/tmp/nginx" "/var/cache/nginx" "/var/log/nginx" "/usr/share/nginx/html"; do
    if [ ! -d "$dir" ]; then
        echo "Creando directorio: $dir"
        mkdir -p "$dir"
    fi
    echo "Configurando permisos para: $dir"
    chmod -R 777 "$dir"
done

echo "Verificando configuración de nginx..."
nginx -t

echo "Iniciando nginx..."
exec nginx
