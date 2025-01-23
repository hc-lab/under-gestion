# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create start script
RUN echo '#!/bin/sh\n\
PORT="${PORT:-8080}"\n\
sed -i "s/listen 80/listen $PORT/" /etc/nginx/nginx.conf\n\
nginx -g "daemon off;"' > /start.sh && \
chmod +x /start.sh

CMD ["/start.sh"]
