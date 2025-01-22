# Etapa de instalación de dependencias del frontend
FROM node:18-alpine as frontend-deps

WORKDIR /frontend

# Establecer variables de entorno para producción
ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=512"

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Copiar solo los archivos necesarios para la instalación
COPY frontend/package*.json ./
COPY frontend/.babelrc ./

# Instalar dependencias de producción y desarrollo necesarias
RUN npm install --no-package-lock --no-audit --no-fund && \
    npm install --no-package-lock --no-audit --no-fund \
    @babel/plugin-proposal-private-property-in-object \
    @babel/plugin-transform-private-property-in-object \
    @babel/plugin-proposal-class-properties \
    @babel/plugin-transform-class-properties

# Etapa de construcción del frontend
FROM node:16-alpine as frontend-build

WORKDIR /frontend

# Establecer variables de entorno para producción
ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=512" \
    DISABLE_ESLINT_PLUGIN=true \
    CI=false \
    PATH="/frontend/node_modules/.bin:${PATH}"

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Copiar package.json y package-lock.json
COPY frontend/package*.json ./

# Limpiar node_modules existentes si existen
RUN if [ -d "node_modules" ]; then rm -rf node_modules; fi

# Instalar todas las dependencias necesarias de una vez
RUN npm install --save \
    react@18.2.0 \
    react-dom@18.2.0 \
    react-router-dom@6.14.0 \
    react-scripts@5.0.1 \
    styled-components@6.0.0-rc.3 \
    @mui/material@5.13.5 \
    @mui/icons-material@5.11.16 \
    @emotion/react@11.11.1 \
    @emotion/styled@11.11.0 \
    axios@1.4.0 \
    @babel/plugin-proposal-private-property-in-object@7.21.11 \
    --legacy-peer-deps

# Copiar el resto de los archivos
COPY frontend/ .

# Construir el frontend
RUN SKIP_PREFLIGHT_CHECK=true npm run build

# Stage para compilar psycopg2 y otras dependencias
FROM python:3.12-slim as builder

WORKDIR /wheels

# Instalar dependencias necesarias para la compilación
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements.txt y construir wheels
COPY backend/requirements.txt .

# Instalar wheel y packaging primero
RUN pip install --no-cache-dir wheel packaging

# Construir wheels para todas las dependencias
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /wheels -r requirements.txt && \
    pip wheel --no-cache-dir --wheel-dir /wheels gunicorn whitenoise packaging

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

# Copiar requirements.txt y wheels
COPY backend/requirements.txt .
COPY --from=builder /wheels /wheels

# Instalar dependencias
RUN pip install --no-cache-dir packaging && \
    pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt && \
    pip install --no-cache-dir --no-index --find-links=/wheels gunicorn whitenoise && \
    rm -rf /wheels /root/.cache/pip/*

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