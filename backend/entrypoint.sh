#!/bin/sh

# Configurar variables de entorno por defecto si no están definidas
: "${PORT:=8080}"
export PORT

echo "Iniciando aplicación en el puerto $PORT"

# En producción, no necesitamos esperar por PostgreSQL ya que Render maneja eso
if [ "$RENDER" = "true" ]; then
    echo "Ejecutando en Render.com..."
    # Pequeña pausa para asegurar que la base de datos esté lista
    sleep 5
else
    # Extraer host y puerto de DATABASE_URL para desarrollo local
    POSTGRES_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\).*/\1/p')
    POSTGRES_PORT=5432
    
    ATTEMPTS=0
    MAX_ATTEMPTS=60
    echo "Esperando a que PostgreSQL esté disponible..."
    until nc -z -v -w30 $POSTGRES_HOST $POSTGRES_PORT || [ $ATTEMPTS -ge $MAX_ATTEMPTS ]; do
        sleep 1
        ATTEMPTS=$((ATTEMPTS + 1))
    done

    if [ $ATTEMPTS -ge $MAX_ATTEMPTS ]; then
        echo "PostgreSQL no inició dentro del tiempo esperado"
        exit 1
    fi

    echo "PostgreSQL iniciado"
fi

# Crear directorios de migraciones si no existen
mkdir -p /app/backend/personales/migrations
mkdir -p /app/backend/productos/migrations
touch /app/backend/personales/migrations/__init__.py
touch /app/backend/productos/migrations/__init__.py

# Generar y aplicar migraciones
echo "Generando migraciones..."
python manage.py makemigrations personales productos

echo "Aplicando migraciones..."
python manage.py migrate --noinput

# Recolectar archivos estáticos
echo "Recolectando archivos estáticos..."
python manage.py collectstatic --noinput

# Crear superusuario si las variables están definidas
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    echo "Creando superusuario..."
    python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username="$DJANGO_SUPERUSER_USERNAME").exists():
    User.objects.create_superuser("$DJANGO_SUPERUSER_USERNAME", "$DJANGO_SUPERUSER_EMAIL", "$DJANGO_SUPERUSER_PASSWORD")
    print("Superusuario creado exitosamente")
else:
    print("El superusuario ya existe")
END
fi

# Iniciar Gunicorn
echo "Iniciando Gunicorn en el puerto $PORT..."
exec gunicorn almacen.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --threads 2 --timeout 60