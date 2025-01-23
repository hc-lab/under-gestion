#!/bin/bash
set -e

# Asegurarnos de estar en el directorio frontend
cd "$(dirname "$0")"

# Construir la imagen
docker build -t frontend-app .

# Mostrar mensaje de éxito
echo "Imagen construida exitosamente"
