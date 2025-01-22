#!/bin/bash

echo "Limpiando caché de Docker..."

# Detener todos los contenedores
docker stop $(docker ps -aq) 2>/dev/null || true

# Eliminar todos los contenedores
docker rm $(docker ps -aq) 2>/dev/null || true

# Eliminar todas las imágenes no utilizadas
docker image prune -af

# Eliminar todos los volúmenes no utilizados
docker volume prune -f

# Eliminar la caché de construcción
docker builder prune -af

# Limpiar caché de npm
echo "Limpiando caché de npm..."
npm cache clean --force

# Eliminar node_modules y reinstalar
echo "Reinstalando dependencias..."
cd frontend
rm -rf node_modules
npm install --legacy-peer-deps

echo "Caché limpiada exitosamente!"
