#!/usr/bin/env bash
# exit on error
set -o errexit

# Instalar dependencias y construir
npm install
npm run build

# Crear directorios para cada ruta
mkdir -p build/dashboard
mkdir -p build/login
mkdir -p build/productos
mkdir -p build/personal
mkdir -p build/blasting
mkdir -p build/rrhh

# Copiar index.html a cada directorio
cp build/index.html build/dashboard/
cp build/index.html build/login/
cp build/index.html build/productos/
cp build/index.html build/personal/
cp build/index.html build/blasting/
cp build/index.html build/rrhh/ 