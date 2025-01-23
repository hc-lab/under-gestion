# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && ls -la build/

# Production stage
FROM nginx:alpine

# Remove default nginx static files and config
RUN rm -rf /usr/share/nginx/html/* && \
    rm -rf /etc/nginx/conf.d/*

# Create required directories
RUN mkdir -p /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    chmod 777 /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp

# Copy build files and verify
COPY --from=build /app/build /usr/share/nginx/html/
RUN ls -la /usr/share/nginx/html/ && echo "Contenido de index.html:" && cat /usr/share/nginx/html/index.html

# Copy nginx config and startup script
COPY nginx.conf /etc/nginx/nginx.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

CMD ["/docker-entrypoint.sh"]
