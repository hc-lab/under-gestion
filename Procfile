release: python manage.py migrate
web: gunicorn --chdir /app/backend almacen.wsgi:application --bind 0.0.0.0:${PORT:-8000}
