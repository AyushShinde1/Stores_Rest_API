#!/bin/sh
set -e

# Ensure models are imported before migrations!
export FLASK_APP=app:create_app
export FLASK_ENV=development  # enables debug mode and auto-reload


echo "Running database migrations..."
# Always create migration if none exists
if [ ! -d "./migrations" ] || [ -z "$(ls -A migrations/versions 2>/dev/null)" ]; then
    echo "Initializing migrations..."
    flask db init || true  # ignore if already exists
    flask db migrate -m "initial migration"
fi

flask db upgrade

echo "Starting Gunicorn..."
#exec gunicorn --bind 0.0.0.0:80 "app:create_app()"
#flask run --host=0.0.0.0 --port=80
flask run --host=0.0.0.0 --port=80 #--no-reload


