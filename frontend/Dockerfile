# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Debug: Mostrar directorio actual
RUN pwd && ls -la

# Copiar solo los archivos necesarios primero
COPY package*.json ./
COPY webpack.config.js ./
COPY tailwind.config.js ./
COPY .babelrc ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY src/ ./src/
COPY public/ ./public/

# Debug: Mostrar archivos copiados
RUN ls -la

# Set environment variable for production build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Construir la aplicación
RUN npm run build

# Debug: Mostrar contenido del build
RUN ls -la build/

# Production stage
FROM nginx:alpine

# Remover el contenido por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos construidos
COPY --from=build /app/build /usr/share/nginx/html

# Debug: Verificar contenido de nginx html
RUN ls -la /usr/share/nginx/html/

# Copiar la configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Script de inicio
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Configurar permisos
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Debug final: Verificar contenido y permisos
RUN ls -la /usr/share/nginx/html/

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
