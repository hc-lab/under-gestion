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
    ls -la build/static/css/ && \
    echo -e "\n=== Contenido de index.html ===" && \
    cat build/index.html

# Production stage
FROM nginx:alpine

# Install required packages
RUN apk add --no-cache bash gettext

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Create necessary directories with correct permissions
RUN mkdir -p /app/frontend/build/static/js \
    && mkdir -p /app/frontend/build/static/css \
    && mkdir -p /app/frontend/build/static/media \
    && chown -R nginx:nginx /app

# Copy the entire build directory with explicit paths
COPY --from=build /app/build/index.html /app/frontend/build/
COPY --from=build /app/build/static/js/ /app/frontend/build/static/js/
COPY --from=build /app/build/static/css/ /app/frontend/build/static/css/
COPY --from=build /app/build/static/media/ /app/frontend/build/static/media/

# Verify the copied files
RUN echo "=== Verificando archivos copiados ===" && \
    ls -la /app/frontend/build/ && \
    echo -e "\n=== Verificando archivos estáticos ===" && \
    ls -la /app/frontend/build/static/ && \
    echo -e "\n=== Verificando archivos JS ===" && \
    ls -la /app/frontend/build/static/js/ && \
    echo -e "\n=== Verificando archivos CSS ===" && \
    ls -la /app/frontend/build/static/css/ && \
    echo -e "\n=== Verificando permisos ===" && \
    ls -la /app/frontend/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Set permissions
RUN chown -R nginx:nginx /app/frontend/build \
    && chmod -R 755 /app/frontend/build

# Set entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
