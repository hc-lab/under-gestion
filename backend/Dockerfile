# Build stage para el frontend
FROM node:18 as frontend-build

WORKDIR /frontend
COPY frontend/ .
RUN npm install
RUN npm run build

# Stage final con Python y Nginx
FROM python:3.12-slim

# Instalar nginx y dependencias necesarias
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    nginx \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Establecer el directorio de trabajo
WORKDIR /app/backend

# Copiar el contenido del directorio backend
COPY backend/ .

# Crear directorios necesarios
RUN mkdir -p static staticfiles

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt \
    && rm -rf ~/.cache/pip/*

# Copiar los archivos del frontend construido
COPY --from=frontend-build /frontend/dist /var/www/html

# Copiar la configuración de nginx
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Configurar variables de entorno
ENV PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=almacen.settings \
    PYTHONPATH=/app/backend \
    PORT=8000

# Verificar la estructura y permisos
RUN ls -la && \
    chmod +x manage.py

# Crear script de inicio
RUN echo '#!/bin/sh\n\
    cd /app/backend\n\
    echo "Running collectstatic..."\n\
    python manage.py collectstatic --noinput --clear\n\
    echo "Running migrations..."\n\
    python manage.py migrate\n\
    echo "Creating superuser..."\n\
    python manage.py createsuperuser --noinput || echo "Superuser already exists"\n\
    echo "Starting Nginx..."\n\
    service nginx start\n\
    echo "Starting Gunicorn..."\n\
    exec gunicorn --chdir /app/backend almacen.wsgi:application --log-file - --bind 0.0.0.0:${PORT:-8000} --preload' > /start.sh && \
    chmod +x /start.sh

# Exponer puertos
EXPOSE 80 8000

# Comando para iniciar la aplicación
CMD ["/start.sh"]