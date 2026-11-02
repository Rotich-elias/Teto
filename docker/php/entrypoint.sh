#!/bin/sh
set -e

cd /var/www/html

mkdir -p \
    storage/framework/sessions \
    storage/framework/views \
    storage/framework/cache \
    storage/logs \
    bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

# Composer runs with --no-scripts in the image build, so discovery happens here.
php artisan package:discover --ansi

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    attempt=1
    until php artisan migrate --force --no-interaction; do
        if [ "$attempt" -ge 12 ]; then
            echo "Database migrations failed after ${attempt} attempts." >&2
            exit 1
        fi
        echo "Waiting for the database (attempt ${attempt})..."
        attempt=$((attempt + 1))
        sleep 3
    done
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache

exec "$@"
