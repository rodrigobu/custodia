#!/bin/bash
set -e

echo "Running collectstatic..."
python manage.py collectstatic --no-input

echo "Running migrations..."
python manage.py migrate

echo "Starting gunicorn..."
exec gunicorn config.wsgi --bind 0.0.0.0:8000
