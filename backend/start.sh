#!/bin/bash
set -e

echo "Iniciando servicios..."

# Cambiar al directorio del backend
cd /app/backend

# Ejecutar migraciones
echo "Aplicando migraciones..."
python manage.py migrate --noinput

# Recolectar archivos estáticos
echo "Recolectando archivos estáticos..."
python manage.py collectstatic --noinput

# Crear superusuario si no existe
echo "Verificando superusuario..."
python manage.py createsuperuser --noinput || echo "Superuser already exists"

# Asegurarse de que los directorios necesarios existan
mkdir -p /run/nginx
chown -R www-data:www-data /var/www/html
chown -R www-data:www-data /run/nginx

# Iniciar nginx
echo "Iniciando nginx..."
nginx -t && service nginx start

# Esperar un momento para asegurarse de que nginx haya iniciado
sleep 2

# Verificar que nginx esté corriendo
if ! pgrep nginx > /dev/null; then
    echo "Error: nginx no se pudo iniciar"
    exit 1
fi

echo "Iniciando Gunicorn..."
# Iniciar Gunicorn
exec gunicorn almacen.wsgi:application \
    --log-file - \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --preload
