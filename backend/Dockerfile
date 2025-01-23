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
    NODE_OPTIONS="--max-old-space-size=4096" \
    DISABLE_ESLINT_PLUGIN=true \
    CI=false \
    PATH="/frontend/node_modules/.bin:${PATH}"

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Copiar package.json y package-lock.json
COPY frontend/package*.json ./

# Limpiar node_modules existentes si existen
RUN if [ -d "node_modules" ]; then rm -rf node_modules; fi

# Instalar react-scripts primero
RUN npm install --save react-scripts@4.0.3

# Instalar dependencias principales
RUN npm install --save \
    react@17.0.2 \
    react-dom@17.0.2 \
    react-router-dom@5.3.0 \
    styled-components@5.3.0 \
    @mui/material@5.0.0 \
    @mui/icons-material@5.0.0 \
    @emotion/react@11.4.1 \
    @emotion/styled@11.3.0 \
    axios@0.21.1 \
    --legacy-peer-deps

# Copiar el resto de los archivos
COPY frontend/ .

# Limpiar caché y módulos no necesarios antes de construir
RUN npm cache clean --force && \
    rm -rf node_modules/.cache

# Construir el frontend
RUN SKIP_PREFLIGHT_CHECK=true \
    DISABLE_ESLINT_PLUGIN=true \
    CI=false \
    npm run build

# Verificar que los archivos se construyeron correctamente
RUN ls -la build/

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
FROM python:3.11-slim

WORKDIR /app/backend

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY backend/ .

# Create directory for static files
RUN mkdir -p staticfiles

# Copy frontend build files
COPY --from=frontend-build /frontend/build/ staticfiles/frontend/

# Collect static files
RUN python manage.py collectstatic --noinput

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080
ENV DJANGO_SETTINGS_MODULE=almacen.settings

# Copy and set permissions for start script
COPY backend/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]