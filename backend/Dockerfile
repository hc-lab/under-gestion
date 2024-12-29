# proyecto_root/backend/Dockerfile
FROM python:3.12

WORKDIR /app/backend

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

# Script de inicio para ejecutar migraciones y luego el servidor
COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

RUN apt-get update && apt-get install -y netcat-traditional && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y cron

# Configurar y activar cron
RUN touch /var/log/cron.log
RUN service cron start

# Modificar el CMD para incluir cron
CMD service cron start && python manage.py crontab add && python manage.py runserver 0.0.0.0:8000
