FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create necessary directories
RUN mkdir -p staticfiles

# Copy the entire backend directory
COPY . .

# Create frontend directory
RUN mkdir -p staticfiles/frontend

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000
ENV DJANGO_SETTINGS_MODULE=backend.settings

# Set permissions for start script
RUN chmod +x start.sh

EXPOSE 8000

CMD ["./start.sh"]