FROM node:20.11.0-slim

WORKDIR /app/frontend

# Instalar dependencias globales
RUN npm install -g npm@10.2.4 react-scripts@5.0.1

# Copiar package.json y package-lock.json primero
COPY package*.json ./

# Eliminar el directorio node_modules
RUN rm -rf node_modules

# Instalar dependencias del proyecto
RUN rm -rf /root/.npm/_cacache && \
    npm cache clean --force && \
    npm config set audit false && \
    npm config set fund false && \
    npm install && \
    npm install -D tailwindcss@3.3.0 postcss@8.4.31 postcss-import@15.1.0 autoprefixer@10.4.14 --legacy-peer-deps

# Copiar el resto de los archivos
COPY . .

# Configurar el entorno de desarrollo
ENV NODE_ENV=development
ENV WDS_SOCKET_HOST=0.0.0.0
ENV WDS_SOCKET_PORT=3000
ENV HOST=0.0.0.0
ENV CI=true

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
