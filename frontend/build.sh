#!/bin/bash
set -e

echo "Limpiando contenedores anteriores..."
docker rm -f frontend-app || true

echo "Construyendo la imagen..."
docker build -t frontend-app .

echo "Ejecutando el contenedor..."
docker run -d --name frontend-app -p 8080:8080 frontend-app

echo "Mostrando logs del contenedor..."
docker logs -f frontend-app
