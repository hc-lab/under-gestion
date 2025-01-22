# Usar una imagen base de Python 3.12
FROM python:3.12-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements.txt e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código
COPY . .

# Exponer el puerto (Railway lo sobreescribirá con $PORT)
EXPOSE 8000

# Configurar variables de entorno
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=almacen.settings

# Comando para iniciar la aplicación
CMD ["gunicorn", "almacen.wsgi:application", "--bind", "0.0.0.0:$PORT"]