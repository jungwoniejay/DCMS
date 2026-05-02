#!/bin/sh
set -e

echo "=== Starting DCMS ==="

# Override DB connection from Railway environment variables if provided
if [ -n "$DATABASE_URL" ]; then
    sed -i "s|^DB_CONNECTION=.*|DB_CONNECTION=pgsql|" /app/.env
    # Parse DATABASE_URL into individual components
    # Format: postgresql://user:password@host:port/database
    DB_USER=$(echo "$DATABASE_URL" | sed -E 's|.*://([^:]+):.*|\1|')
    DB_PASS=$(echo "$DATABASE_URL" | sed -E 's|.*://[^:]+:([^@]+)@.*|\1|')
    DB_HOST=$(echo "$DATABASE_URL" | sed -E 's|.*@([^:/]+)[:/].*|\1|')
    DB_PORT=$(echo "$DATABASE_URL" | sed -E 's|.*@[^:]+:([0-9]+)/.*|\1|')
    DB_NAME=$(echo "$DATABASE_URL" | sed -E 's|.*/([^?]+).*|\1|')
    sed -i "s|^DB_HOST=.*|DB_HOST=${DB_HOST}|" /app/.env
    sed -i "s|^DB_PORT=.*|DB_PORT=${DB_PORT}|" /app/.env
    sed -i "s|^DB_DATABASE=.*|DB_DATABASE=${DB_NAME}|" /app/.env
    sed -i "s|^DB_USERNAME=.*|DB_USERNAME=${DB_USER}|" /app/.env
    sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=${DB_PASS}|" /app/.env
    grep -q "^DB_HOST=" /app/.env || echo "DB_HOST=${DB_HOST}" >> /app/.env
    grep -q "^DB_PORT=" /app/.env || echo "DB_PORT=${DB_PORT}" >> /app/.env
    grep -q "^DB_DATABASE=" /app/.env || echo "DB_DATABASE=${DB_NAME}" >> /app/.env
    grep -q "^DB_USERNAME=" /app/.env || echo "DB_USERNAME=${DB_USER}" >> /app/.env
    grep -q "^DB_PASSWORD=" /app/.env || echo "DB_PASSWORD=${DB_PASS}" >> /app/.env
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
