#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
DATABASE_URL=sqlite:///tmp/build_db.sqlite3 python manage.py collectstatic --no-input
python manage.py migrate
