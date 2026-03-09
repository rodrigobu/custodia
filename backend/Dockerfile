FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Collect static files during build with a dummy SECRET_KEY
# (the real SECRET_KEY is only needed at runtime)
RUN SECRET_KEY=dummy-key-for-collectstatic \
    python manage.py collectstatic --no-input

EXPOSE 8000

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
