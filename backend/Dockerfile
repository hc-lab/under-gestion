# Build stage para el frontend
FROM node:18-alpine as frontend-build

WORKDIR /frontend

# Aumentar memoria disponible para Node
ENV NODE_OPTIONS="--max-old-space-size=4096"
# Establecer variables de entorno para producción
ENV NODE_ENV=production
ENV REACT_APP_API_URL=under-gestion-production.up.railway.app

# Copiar solo los archivos de package primero
COPY frontend/package*.json ./

# Instalar dependencias
RUN apk add --no-cache python3 make g++ \
    && npm install --legacy-peer-deps \
    && npm install --save-dev @babel/plugin-proposal-private-property-in-object

# Copiar el resto de los archivos del frontend
COPY frontend/ .

# Construir el frontend con variables de entorno explícitas
RUN DISABLE_ESLINT_PLUGIN=true CI=false npm run build

# Stage para compilar psycopg2
FROM python:3.12-slim as builder

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    libpq-dev \
    && pip install --no-cache-dir psycopg2-binary \
    && mkdir -p /wheels \
    && pip wheel --no-cache-dir --no-deps --wheel-dir /wheels psycopg2-binary

# Stage final
FROM python:3.12-slim

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

# Instalar nginx y dependencias mínimas
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    nginx \
    libpq5 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copiar psycopg2 precompilado e instalar dependencias
COPY --from=builder /wheels /wheels
RUN pip install --no-cache-dir /wheels/* \
    && rm -rf /wheels \
    && pip install --no-cache-dir -r requirements.txt gunicorn whitenoise

# Copiar el resto del backend
COPY backend/ .

# Copiar los archivos del frontend construido
COPY --from=frontend-build /frontend/dist /var/www/html

# Copiar la configuración de nginx
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Verificar la estructura y permisos
RUN chmod +x manage.py

# Crear script de inicio
RUN echo '#!/bin/sh\n\
    cd /app/backend\n\
    python manage.py collectstatic --noinput --clear\n\
    python manage.py migrate\n\
    python manage.py createsuperuser --noinput || echo "Superuser already exists"\n\
    service nginx start\n\
    exec gunicorn --chdir /app/backend almacen.wsgi:application --log-file - --bind 0.0.0.0:${PORT:-8000} --preload' > /start.sh && \
    chmod +x /start.sh

# Exponer puertos
EXPOSE 80 8000

# Comando para iniciar la aplicación
CMD ["/start.sh"]