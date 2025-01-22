# Usar una imagen base de Python 3.12
FROM python:3.12-slim

# Establecer el directorio de trabajo
WORKDIR /app/backend

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements.txt e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del backend
COPY . .

# Exponer el puerto (Railway lo sobreescribirá con PORT)
EXPOSE 8000

# Configurar variables de entorno
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=almacen.settings
ENV PYTHONPATH=/app/backend
ENV PORT=8000

# Verificar la estructura del proyecto
RUN ls -la && \
    echo "Current directory contents:" && \
    pwd && \
    echo "Python path:" && \
    echo $PYTHONPATH

# Crear script de inicio
RUN echo '#!/bin/bash\n\
echo "Current directory: $(pwd)"\n\
echo "Directory contents:"\n\
ls -la\n\
echo "Python path: $PYTHONPATH"\n\
python manage.py collectstatic --noinput\n\
python manage.py migrate\n\
exec gunicorn almacen.wsgi:application --log-file - --bind 0.0.0.0:${PORT:-8000}' > /start.sh && \
    chmod +x /start.sh

# Comando para iniciar la aplicación
CMD ["/start.sh"]