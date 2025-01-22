# Build stage para el frontend
FROM node:18-alpine as frontend-build

WORKDIR /frontend

# Copiar solo los archivos de package primero
COPY frontend/package*.json ./

# Instalar dependencias usando npm ci (más estable que npm install)
RUN apk add --no-cache python3 make g++ \
    && npm config set fetch-retry-maxtimeout 600000 -g \
    && npm config set fetch-retry-mintimeout 100000 -g \
    && npm config set fetch-retries 10 -g \
    && npm ci --prefer-offline --no-audit --legacy-peer-deps

# Copiar el resto de los archivos del frontend
COPY frontend/ .

# Construir el frontend
RUN npm run build

# Stage final con Python Alpine
FROM python:3.12-alpine

# Establecer variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=almacen.settings \
    PYTHONPATH=/app/backend \
    PORT=8000

WORKDIR /app/backend

# Copiar requirements.txt y crear directorios necesarios
COPY backend/requirements.txt .
RUN mkdir -p static staticfiles /run/nginx

# Instalar todas las dependencias en un solo paso
RUN apk add --no-cache \
    nginx \
    postgresql-libs \
    postgresql-dev \
    gcc \
    musl-dev \
    python3-dev \
    && pip install --no-cache-dir -r requirements.txt gunicorn whitenoise psycopg2-binary \
    && rm -rf ~/.cache/pip/* \
    && apk del gcc musl-dev python3-dev postgresql-dev

# Copiar el resto del backend
COPY backend/ .

# Copiar los archivos del frontend construido
COPY --from=frontend-build /frontend/dist /var/www/html

# Copiar la configuración de nginx
COPY frontend/nginx.conf /etc/nginx/http.d/default.conf

# Verificar la estructura y permisos
RUN chmod +x manage.py

# Crear script de inicio
RUN echo '#!/bin/sh\n\
    cd /app/backend\n\
    python manage.py collectstatic --noinput --clear\n\
    python manage.py migrate\n\
    python manage.py createsuperuser --noinput || echo "Superuser already exists"\n\
    nginx\n\
    exec gunicorn --chdir /app/backend almacen.wsgi:application --log-file - --bind 0.0.0.0:${PORT:-8000} --preload' > /start.sh && \
    chmod +x /start.sh

# Exponer puertos
EXPOSE 80 8000

# Comando para iniciar la aplicación
CMD ["/start.sh"]