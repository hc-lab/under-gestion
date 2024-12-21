# proyecto_root/frontend/Dockerfile
FROM node:16

WORKDIR /app/frontend

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

RUN chown -R node:node /app/frontend
