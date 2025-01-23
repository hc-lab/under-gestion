# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Debug: Listar contenido antes de copiar
RUN ls -la

# Copiar package.json y package-lock.json
COPY frontend/package*.json ./

# Debug: Listar contenido después de copiar package.json
RUN ls -la

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del frontend
COPY frontend/ ./

# Debug: Listar contenido después de copiar todo
RUN ls -la

# Set environment variable for production build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Construir la aplicación
RUN npm run build

# Debug: Listar contenido del directorio dist
RUN ls -la dist/

# Production stage
FROM nginx:alpine

# Copiar los archivos construidos
COPY --from=build /app/dist /usr/share/nginx/html/

# Debug: Verificar contenido copiado
RUN ls -la /usr/share/nginx/html/

# Copiar la configuración de nginx
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Script de inicio
COPY frontend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Configurar permisos
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Debug final: Verificar contenido y permisos
RUN ls -la /usr/share/nginx/html/

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
