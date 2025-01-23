# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY frontend/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY frontend/ .

# Set environment variable for production build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Construir la aplicación
RUN npm run build

# Production stage
FROM nginx:alpine

# Instalar bash
RUN apk add --no-cache bash

# Copiar los archivos construidos
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar la configuración de nginx
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Script de inicio
COPY frontend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Crear directorios necesarios
RUN mkdir -p /tmp/nginx && \
    chmod -R 777 /tmp/nginx && \
    chmod -R 777 /var/log/nginx && \
    chmod -R 777 /var/cache/nginx && \
    chmod -R 777 /usr/share/nginx/html

# Variables de entorno por defecto
ENV PORT=80

# Exponer el puerto dinámicamente
EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
