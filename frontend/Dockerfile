# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Construir la aplicación
RUN npm run build

# Production stage
FROM nginx:alpine

# Remover el contenido por defecto de nginx
RUN rm -rf /usr/share/nginx/html/* && \
    rm -rf /etc/nginx/conf.d/*

# Copiar los archivos construidos
COPY --from=build /app/build /usr/share/nginx/html

# Crear template de nginx
RUN echo 'events { \n\
    worker_connections 1024; \n\
} \n\
\n\
http { \n\
    include /etc/nginx/mime.types; \n\
    default_type application/octet-stream; \n\
    sendfile on; \n\
\n\
    server { \n\
        listen $PORT; \n\
        root /usr/share/nginx/html; \n\
        index index.html; \n\
\n\
        location / { \n\
            try_files $uri $uri/ /index.html; \n\
        } \n\
\n\
        location /static/ { \n\
            expires 1y; \n\
            add_header Cache-Control "public"; \n\
        } \n\
    } \n\
}' > /etc/nginx/nginx.template

# Script de inicio
RUN echo '#!/bin/sh \n\
export PORT="${PORT:-8080}" \n\
envsubst "\$PORT" < /etc/nginx/nginx.template > /etc/nginx/nginx.conf \n\
nginx -g "daemon off;"' > /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Configurar permisos
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
