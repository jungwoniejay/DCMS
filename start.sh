#!/bin/sh
set -e

echo "=== Starting DCMS ==="

# Generate .env from Railway environment variables if it doesn't exist
if [ ! -f /app/.env ]; then
    echo "Generating .env from environment variables..."
    cat > /app/.env << EOF
APP_NAME=${APP_NAME:-Brgy2DMS}
APP_ENV=${APP_ENV:-production}
APP_KEY=${APP_KEY}
APP_DEBUG=${APP_DEBUG:-false}
APP_URL=${APP_URL:-http://localhost}
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US
APP_MAINTENANCE_DRIVER=file
PHP_CLI_SERVER_WORKERS=4
BCRYPT_ROUNDS=12
LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error
DB_CONNECTION=pgsql
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT:-5432}
DB_DATABASE=${DB_DATABASE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=true
SESSION_PATH=/
SESSION_DOMAIN=null
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
CACHE_STORE=database
MAIL_MAILER=log
VITE_APP_NAME=\${APP_NAME}
ADMIN_REGISTER_KEY=${ADMIN_REGISTER_KEY:-Brgy2DMS@AdminKey2024}
EOF
fi

# If DATABASE_URL is set, parse and override DB vars
if [ -n "$DATABASE_URL" ]; then
    DB_USER=$(echo "$DATABASE_URL" | sed -E 's|.*://([^:]+):.*|\1|')
    DB_PASS=$(echo "$DATABASE_URL" | sed -E 's|.*://[^:]+:([^@]+)@.*|\1|')
    DB_HOST=$(echo "$DATABASE_URL" | sed -E 's|.*@([^:/]+)[:/].*|\1|')
    DB_PORT=$(echo "$DATABASE_URL" | sed -E 's|.*@[^:]+:([0-9]+)/.*|\1|')
    DB_NAME=$(echo "$DATABASE_URL" | sed -E 's|.*/([^?]+).*|\1|')
    sed -i "s|^DB_CONNECTION=.*|DB_CONNECTION=pgsql|" /app/.env
    sed -i "s|^DB_HOST=.*|DB_HOST=${DB_HOST}|" /app/.env
    sed -i "s|^DB_PORT=.*|DB_PORT=${DB_PORT}|" /app/.env
    sed -i "s|^DB_DATABASE=.*|DB_DATABASE=${DB_NAME}|" /app/.env
    sed -i "s|^DB_USERNAME=.*|DB_USERNAME=${DB_USER}|" /app/.env
    sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=${DB_PASS}|" /app/.env
    echo "DB configured from DATABASE_URL: host=${DB_HOST} db=${DB_NAME}"
fi

# Fix permissions on volume
chmod -R 777 /app/storage/app/public 2>/dev/null || true

# Create upload directories inside volume
mkdir -p /app/storage/app/public/enrollment_photos
mkdir -p /app/storage/app/public/profile_pictures

# Force correct symlink (artisan storage:link sometimes creates wrong path)
rm -f /app/public/storage
ln -sfn /app/storage/app/public /app/public/storage
echo "Symlink: $(readlink /app/public/storage)"

# Clear old caches
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Rebuild caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

echo "=== DCMS Ready - Starting server on port ${PORT:-8080} ==="

exec php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
