# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Construir la aplicación
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar los archivos construidos
COPY --from=build /app/build /usr/share/nginx/html

# Copiar archivos de configuración
COPY nginx.conf.template /app/frontend/nginx.conf.template
COPY start.sh /app/frontend/start.sh

# Configurar permisos
RUN chmod +x /app/frontend/start.sh && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

USER nginx

EXPOSE 8080

CMD ["/app/frontend/start.sh"]
