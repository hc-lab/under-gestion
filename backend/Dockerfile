# Usa Node.js 18 como imagen base para construir el frontend
FROM node:18-alpine as frontend-build

WORKDIR /frontend

# Establecer variables de entorno para producción
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV REACT_APP_API_URL=under-gestion-production.up.railway.app

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Copia package.json y package-lock.json
COPY frontend/package*.json ./
COPY frontend/.babelrc ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN NODE_ENV=development npm install --legacy-peer-deps

# Copiar el resto de los archivos del frontend
COPY frontend/ .

# Construir el frontend con variables explícitas
RUN BABEL_ENV=production NODE_ENV=production npm run build

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

# Crear directorios necesarios
RUN mkdir -p /app/backend/static \
    /app/backend/media \
    /app/backend/staticfiles \
    /var/www/html \
    /run/nginx \
    /var/log/nginx \
    /var/lib/nginx/body \
    /var/lib/nginx/fastcgi \
    /var/lib/nginx/proxy \
    /var/lib/nginx/scgi \
    /var/lib/nginx/uwsgi

# Instalar nginx y dependencias mínimas
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    nginx \
    libpq5 \
    procps \
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
COPY --from=frontend-build /frontend/build /var/www/html/

# Eliminar la configuración por defecto de nginx
RUN rm -f /etc/nginx/sites-enabled/default

# Copiar la configuración de nginx
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Configurar permisos
RUN chmod +x manage.py \
    && python manage.py collectstatic --noinput \
    && chown -R www-data:www-data \
        /var/www/html \
        /app/backend/static \
        /app/backend/media \
        /run/nginx \
        /var/log/nginx \
        /var/lib/nginx \
    && chmod -R 755 /var/www/html /var/lib/nginx

# Script de inicio
COPY backend/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]