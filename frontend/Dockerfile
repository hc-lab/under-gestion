# proyecto_root/frontend/Dockerfile
# Build stage
FROM node:18 as build

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

# Crear directorios necesarios y establecer permisos
RUN mkdir -p /tmp/nginx && \
    mkdir -p /var/cache/nginx && \
    mkdir -p /var/log/nginx && \
    chown -R nobody:nobody /tmp/nginx && \
    chown -R nobody:nobody /var/cache/nginx && \
    chown -R nobody:nobody /var/log/nginx && \
    chown -R nobody:nobody /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chmod -R 755 /tmp/nginx && \
    chmod -R 755 /var/cache/nginx && \
    chmod -R 755 /var/log/nginx

# Variables de entorno por defecto
ENV PORT=80

EXPOSE ${PORT}

USER nobody

ENTRYPOINT ["/docker-entrypoint.sh"]
