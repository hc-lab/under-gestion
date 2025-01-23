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

# Instalar bash y envsubst
RUN apk add --no-cache bash gettext

# Copiar los archivos construidos
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar la configuración de nginx como template
COPY frontend/nginx.conf /etc/nginx/nginx.conf.template

# Script de inicio
COPY frontend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Crear directorio para los logs de nginx
RUN mkdir -p /var/log/nginx

# Asegurarse de que nginx puede escribir en los directorios necesarios
RUN chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Variables de entorno por defecto
ENV PORT=80

EXPOSE ${PORT}

ENTRYPOINT ["/docker-entrypoint.sh"]
