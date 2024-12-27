# proyecto_root/frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app/frontend

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias específicas
RUN npm install --production --silent && \
    npm install react-scripts@5.0.1 -g --silent

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]

