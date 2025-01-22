# Usar una imagen base de Python 3.12
FROM python:3.12-slim

# Establecer el directorio de trabajo
WORKDIR /app/backend

# Instalar dependencias del sistema y limpiar en el mismo paso
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copiar el contenido del directorio backend
COPY backend/ .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt \
    && rm -rf ~/.cache/pip/*

# Configurar variables de entorno
ENV PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=almacen.settings \
    PYTHONPATH=/app/backend \
    PORT=8000

# Verificar la estructura y permisos
RUN ls -la && \
    chmod +x manage.py && \
    python -c "import sys; print('Python path:', sys.path)" && \
    python -c "import os; print('Current directory:', os.getcwd())"

# Crear script de inicio
RUN echo '#!/bin/sh\n\
    cd /app/backend\n\
    echo "Current directory: $(pwd)"\n\
    echo "Python path: $PYTHONPATH"\n\
    echo "Directory contents:"\n\
    ls -la\n\
    echo "Running collectstatic..."\n\
    python manage.py collectstatic --noinput\n\
    echo "Running migrations..."\n\
    python manage.py migrate\n\
    echo "Creating superuser..."\n\
    python manage.py createsuperuser --noinput || echo "Superuser already exists"\n\
    echo "Starting Gunicorn..."\n\
    exec gunicorn --chdir /app/backend almacen.wsgi:application --log-file - --bind 0.0.0.0:${PORT:-8000} --preload' > /start.sh && \
    chmod +x /start.sh

# Exponer el puerto
EXPOSE 8000

# Comando para iniciar la aplicación
CMD ["/start.sh"]