#!/bin/sh
set -e

echo "=== Starting DCMS ==="

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
