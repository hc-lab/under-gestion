#!/bin/sh
set -e

# Configurar el puerto si no está definido
export PORT=${PORT:-8080}
echo "Puerto configurado: $PORT"

# Iniciar nginx
exec nginx
