# Usar una imagen base de Python 3.12
FROM python:3.12-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema y limpiar en el mismo paso
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copiar todo el contenido del directorio actual
COPY . .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt \
    && rm -rf ~/.cache/pip/*

# Configurar variables de entorno
ENV PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=almacen.settings \
    PYTHONPATH=/app \
    PORT=8000

# Crear script de inicio
RUN echo '#!/bin/sh\n\
python manage.py collectstatic --noinput\n\
python manage.py migrate\n\
exec gunicorn almacen.wsgi:application --log-file - --bind 0.0.0.0:${PORT:-8000}' > /start.sh && \
    chmod +x /start.sh

# Exponer el puerto
EXPOSE 8000

# Comando para iniciar la aplicación
CMD ["/start.sh"]