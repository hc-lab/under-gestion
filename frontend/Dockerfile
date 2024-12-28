# proyecto_root/frontend/Dockerfile
FROM node:20-alpine 

WORKDIR /app/frontend

# Copiar package.json y package-lock.json
COPY package*.json ./

#20
RUN rm -rf /root/.npm && \
    rm -f package-lock.json && \
    npm cache clean --force && \
    RUN npm install\
    RUN npm install @react-pdf/renderer html2canvas jspdf\ 
    npm install -g npm@latest && \
    npm install --legacy-peer-deps --force

# Instalar ajv explícitamente (para resolver el error de ajv/dist/compile/codegen)
RUN npm install ajv@latest ajv-keywords@latest

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]

