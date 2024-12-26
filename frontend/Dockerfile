# proyecto_root/frontend/Dockerfile
FROM node:16.20-alpine

WORKDIR /app/frontend

# Actualizar npm a una versión específica
RUN npm install -g npm@8.19.4

# Copiar package.json y package-lock.json primero
COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar el resto de los archivos
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]

