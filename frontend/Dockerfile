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
RUN echo "Contenido del directorio build:" && \
    ls -la build/ && \
    echo "Contenido del directorio build/static:" && \
    ls -la build/static/ && \
    echo "Contenido de index.html:" && \
    cat build/index.html

# Production stage
FROM nginx:alpine

# Install required packages
RUN apk add --no-cache bash gettext

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static files from builder
COPY --from=build /app/build /app/frontend/build

# Verify the copied files
RUN echo "Verificando archivos copiados:" && \
    ls -la /app/frontend/build/ && \
    echo "Verificando archivos estáticos:" && \
    ls -la /app/frontend/build/static/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
