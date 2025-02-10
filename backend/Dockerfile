# Usar una imagen base de Python 3.12
FROM python:3.12

# Establecer el directorio de trabajo
WORKDIR /app/backend

# Copiar el archivo de requisitos e instalar las dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código
COPY . .
RUN chmod +x /app/backend/start.sh

# Exponer el puerto 10000
EXPOSE 10000

# Configurar el PYTHONPATH para que Django encuentre los módulos
ENV PYTHONPATH=/app/backend

# Instalar herramientas adicionales (netcat y cron)
RUN apt-get update && apt-get install -y \
    netcat-traditional \
    cron \
    && rm -rf /var/lib/apt/lists/*

# Crear el archivo de log para cron
RUN touch /var/log/cron.log

# Copiar el script de entrypoint y dar permisos de ejecución
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Configurar cron
RUN service cron start

# Comando de inicio
CMD ["/entrypoint.sh"]