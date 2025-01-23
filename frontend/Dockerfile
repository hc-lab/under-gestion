# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Create required directories
RUN mkdir -p /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    chmod 777 /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html/

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create start script
RUN echo '#!/bin/sh\n\
export PORT="${PORT:-8080}"\n\
echo "Puerto configurado: $PORT"\n\
sed -i "s/listen 80/listen $PORT/" /etc/nginx/nginx.conf\n\
echo "Configuración de nginx:"\n\
cat /etc/nginx/nginx.conf\n\
echo "Iniciando nginx..."\n\
exec nginx -g "daemon off;"' > /start.sh && \
chmod +x /start.sh

CMD ["/start.sh"]
