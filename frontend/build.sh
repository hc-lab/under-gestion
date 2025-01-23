#!/bin/bash
set -e

echo "Limpiando contenedores anteriores..."
docker rm -f frontend-app || true

echo "Instalando dependencias..."
npm ci

echo "Construyendo la aplicación..."
npm run build

echo "Copiando archivos al directorio estático..."
rm -rf ../backend/staticfiles/frontend
mkdir -p ../backend/staticfiles/frontend
cp -r build/* ../backend/staticfiles/frontend/

echo "Construyendo la imagen..."
docker build -t frontend-app .

echo "Ejecutando el contenedor..."
docker run -d --name frontend-app -p 8080:8080 frontend-app

echo "Mostrando logs del contenedor..."
docker logs -f frontend-app

echo "Build completado y archivos copiados a staticfiles/frontend/"
