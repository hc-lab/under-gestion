#!/bin/bash
set -e

# Obtener el puerto del entorno o usar 8080 por defecto
export NGINX_PORT="${PORT:-8080}"
echo "Puerto configurado: $NGINX_PORT"

# Función para verificar archivos
check_file() {
    local file="$1"
    if [ -f "$file" ]; then
        echo " Archivo encontrado: $file"
        ls -l "$file"
    else
        echo " ERROR: Archivo no encontrado: $file"
        echo "Contenido del directorio padre:"
        ls -la "$(dirname "$file")"
        return 1
    fi
}

# Verificar estructura de archivos
echo "=== Verificando estructura de archivos ==="
echo "Contenido de /app/frontend:"
ls -la /app/frontend/
echo -e "\nContenido de /app/frontend/build:"
ls -la /app/frontend/build/
echo -e "\nContenido de /app/frontend/build/static:"
ls -la /app/frontend/build/static/
echo -e "\nContenido de /app/frontend/build/static/js:"
ls -la /app/frontend/build/static/js/
echo -e "\nContenido de /app/frontend/build/static/css:"
ls -la /app/frontend/build/static/css/

# Asegurarse de que no haya archivos por defecto
echo "=== Limpiando archivos por defecto ==="
rm -rf /usr/share/nginx/html/50x.html

# Verificar archivos críticos
echo -e "\n=== Verificando archivos críticos ==="
check_file "/usr/share/nginx/html/index.html"
check_file "/usr/share/nginx/html/static/js/main.e5ffc45d.js"
check_file "/usr/share/nginx/html/static/css/main.a1768e97.css"

# Asegurar que los directorios necesarios existan y tengan los permisos correctos
echo -e "\n=== Configurando permisos ==="
mkdir -p /run/nginx
mkdir -p /var/log/nginx
mkdir -p /var/lib/nginx/body
mkdir -p /var/lib/nginx/fastcgi
mkdir -p /var/lib/nginx/proxy
mkdir -p /var/lib/nginx/scgi
mkdir -p /var/lib/nginx/uwsgi

# Configurar permisos
chown -R nginx:nginx /app/frontend/build
chmod -R 755 /app/frontend/build
chown -R nginx:nginx /var/cache/nginx
chown -R nginx:nginx /var/log/nginx
chown -R nginx:nginx /etc/nginx
chown -R nginx:nginx /var/lib/nginx
chown -R nginx:nginx /run/nginx

# Reemplazar variables en la configuración de nginx
echo -e "\n=== Configurando nginx ==="
envsubst '$NGINX_PORT $GUNICORN_PORT' < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf.tmp
mv /etc/nginx/nginx.conf.tmp /etc/nginx/nginx.conf

# Verificar la configuración de nginx
echo -e "\n=== Verificando configuración de nginx ==="
nginx -t || (echo "Error en la configuración de nginx" && cat /etc/nginx/nginx.conf && exit 1)

# Mostrar la configuración final
echo -e "\n=== Configuración final de nginx ==="
cat /etc/nginx/nginx.conf

# Iniciar nginx
echo -e "\n=== Iniciando nginx ==="
nginx -g "daemon off;"
