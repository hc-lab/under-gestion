# proyecto_root/frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app/frontend

# Copiar package.json y package-lock.json primero
COPY package*.json ./

# Instalar dependencias con una versión específica de npm
RUN npm install --legacy-peer-deps

# Copiar el resto de los archivos
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
RUN chown -R node:node /app/frontend

