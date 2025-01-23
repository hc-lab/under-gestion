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

# Show build contents
RUN echo "=== Contenido del directorio build ===" && \
    ls -la build/ && \
    echo -e "\n=== Contenido del directorio build/static ===" && \
    ls -la build/static/ && \
    echo -e "\n=== Contenido de index.html ===" && \
    cat build/index.html

# Production stage
FROM nginx:alpine

# Install required packages
RUN apk add --no-cache bash gettext

# Create directory for frontend
RUN mkdir -p /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Copy build files from builder stage
COPY --from=build --chown=nginx:nginx /app/build/* /usr/share/nginx/html/
COPY --from=build --chown=nginx:nginx /app/build/static /usr/share/nginx/html/static

# Verify the copied files
RUN echo "=== Verificando archivos copiados ===" && \
    ls -la /usr/share/nginx/html/ && \
    echo -e "\n=== Verificando index.html ===" && \
    cat /usr/share/nginx/html/index.html && \
    echo -e "\n=== Verificando archivos estáticos ===" && \
    ls -la /usr/share/nginx/html/static/js/ && \
    ls -la /usr/share/nginx/html/static/css/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Switch to non-root user
USER nginx

# Set entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
