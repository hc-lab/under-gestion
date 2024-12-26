# proyecto_root/frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app/frontend

# Copiar package.json y package-lock.json primero
COPY package*.json ./

# Instalar dependencias con flags para resolver problemas de compatibilidad
RUN npm install --legacy-peer-deps --no-package-lock

# Copiar el resto de los archivos
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]

