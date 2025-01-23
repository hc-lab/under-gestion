# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html/

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create start script
RUN echo '#!/bin/sh\n\
PORT="${PORT:-8080}"\n\
sed -i "s/listen 80/listen $PORT/" /etc/nginx/nginx.conf\n\
echo "Nginx configurado para escuchar en puerto: $PORT"\n\
cat /etc/nginx/nginx.conf\n\
nginx -g "daemon off;"' > /start.sh && \
chmod +x /start.sh

CMD ["/start.sh"]
