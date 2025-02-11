#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

# Crear un archivo rewrite en el directorio build
echo '/* /index.html 200' > build/_redirects 