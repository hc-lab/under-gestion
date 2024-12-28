# proyecto_root/frontend/Dockerfile
FROM node:20-alpine 

WORKDIR /app/frontend

# Copiar package.json y package-lock.json
COPY package*.json ./

# Limpiar caché e instalar dependencias
RUN rm -rf /root/.npm && \
    rm -f package-lock.json && \
    npm cache clean --force && \
    npm install -g npm@latest && \
    npm install --legacy-peer-deps --force && \
    npm install html2canvas jspdf @react-pdf/renderer --legacy-peer-deps && \
    npm install ajv@latest ajv-keywords@latest

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]

