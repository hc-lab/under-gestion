#!/bin/sh

# Esperar a que la base de datos esté lista
echo "Waiting for database..."
while ! nc -z db 5432; do
    sleep 0.1
done
echo "Database started"

# Crear directorios de migraciones si no existen
mkdir -p /app/backend/personales/migrations
mkdir -p /app/backend/productos/migrations
touch /app/backend/personales/migrations/__init__.py
touch /app/backend/productos/migrations/__init__.py

# Generar migraciones si no existen
echo "Generating migrations..."
python manage.py makemigrations personales
python manage.py makemigrations productos

# Aplicar migraciones en orden
echo "Applying migrations..."
python manage.py migrate contenttypes --noinput
python manage.py migrate auth --noinput
python manage.py migrate admin --noinput
python manage.py migrate sessions --noinput
python manage.py migrate authtoken --noinput
python manage.py migrate personales --noinput
python manage.py migrate productos --noinput

# Crear superusuario si no existe
echo "Creating superuser..."
python manage.py shell << END
from django.contrib.auth.models import User
from personales.models import Perfil
try:
    # Eliminar usuario si existe (para asegurar credenciales correctas)
    User.objects.filter(username='admin').delete()
    
    # Crear nuevo superusuario
    user = User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin123'
    )
    
    # Crear o actualizar perfil
    perfil, created = Perfil.objects.get_or_create(
        user=user,
        defaults={'rol': 'ADMIN'}
    )
    print(f"Superuser created/updated successfully with profile: {perfil}")
    
except Exception as e:
    print(f"Error in superuser creation: {str(e)}")
END

# Iniciar el servidor
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000 