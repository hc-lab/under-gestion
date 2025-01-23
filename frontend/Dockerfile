# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Show the contents of the build directory
RUN echo "=== Contenido del directorio build ===" && \
    ls -la build/ && \
    echo -e "\n=== Contenido del directorio build/static ===" && \
    ls -la build/static/ && \
    echo -e "\n=== Contenido del directorio build/static/js ===" && \
    ls -la build/static/js/ && \
    echo -e "\n=== Contenido del directorio build/static/css ===" && \
    ls -la build/static/css/

# Production stage
FROM nginx:alpine

# Install required packages
RUN apk add --no-cache bash gettext

# Remove default nginx static assets and create directory
RUN rm -rf /usr/share/nginx/html/* && \
    mkdir -p /usr/share/nginx/html

# Copy static files from builder
COPY --from=build /app/build /usr/share/nginx/html

# Verify the copied files
RUN echo "=== Verificando archivos copiados ===" && \
    ls -la /usr/share/nginx/html/ && \
    echo -e "\n=== Verificando archivos estáticos ===" && \
    ls -la /usr/share/nginx/html/static/ && \
    echo -e "\n=== Verificando archivos JS ===" && \
    ls -la /usr/share/nginx/html/static/js/ && \
    echo -e "\n=== Verificando archivos CSS ===" && \
    ls -la /usr/share/nginx/html/static/css/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Switch to non-root user
USER nginx

# Set entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
