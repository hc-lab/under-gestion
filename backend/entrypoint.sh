#!/bin/sh

# Esperar a que la base de datos esté lista


# Iniciar el servidor
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000 