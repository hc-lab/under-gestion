release: python backend/manage.py migrate
web: gunicorn --chdir backend almacen.wsgi:application --bind 0.0.0.0:$PORT
