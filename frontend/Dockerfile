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
RUN echo '#!/bin/sh\nsed -i "s/listen 80/listen $PORT/" /etc/nginx/nginx.conf\nnginx -g "daemon off;"' > /start.sh && \
    chmod +x /start.sh

CMD ["/start.sh"]
