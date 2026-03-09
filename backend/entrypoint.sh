#!/bin/bash
set -e

if [ -z "$DATABASE_URL" ]; then
    echo "WARNING: DATABASE_URL is not set. Check your Render environment variables."
    echo "The database service may not be provisioned yet."
    exit 1
fi

echo "Running collectstatic..."
python manage.py collectstatic --no-input

echo "Waiting for database..."
MAX_RETRIES=10
RETRY_COUNT=0
until python -c "
import dj_database_url, psycopg2
db = dj_database_url.parse('$DATABASE_URL')
psycopg2.connect(
    dbname=db['NAME'], user=db['USER'], password=db['PASSWORD'],
    host=db['HOST'], port=db['PORT']
).close()
" 2>/dev/null; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "ERROR: Could not connect to database after $MAX_RETRIES attempts."
        exit 1
    fi
    echo "Database not ready yet (attempt $RETRY_COUNT/$MAX_RETRIES). Waiting 3s..."
    sleep 3
done
echo "Database is ready!"

echo "Running migrations..."
python manage.py migrate

echo "Starting gunicorn..."
exec gunicorn config.wsgi --bind 0.0.0.0:8000
