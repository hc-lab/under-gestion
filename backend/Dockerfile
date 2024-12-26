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
