#!/bin/bash
set -e

echo "Starting Django server..."
echo "Port: $PORT"

# Verify frontend files
echo "Verifying frontend files..."
if [ -f "staticfiles/frontend/index.html" ]; then
    echo "Frontend files found"
    ls -la staticfiles/frontend/
else
    echo "Warning: Frontend files not found in staticfiles/frontend/"
    echo "Current directory structure:"
    ls -R
fi

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start Gunicorn
echo "Starting Gunicorn..."
exec gunicorn backend.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3 \
    --log-level debug \
    --access-logfile - \
    --error-logfile -
