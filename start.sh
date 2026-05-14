#!/bin/sh

echo "=== Starting DCMS ==="

# Clear stale caches
rm -rf /app/bootstrap/cache/*.php 2>/dev/null || true
rm -rf /app/storage/framework/views/*.php 2>/dev/null || true
rm -rf /app/storage/framework/cache/data/* 2>/dev/null || true
echo "Caches cleared"

# Build .env from Railway environment variables
cat > /app/.env << EOF
APP_NAME=${APP_NAME:-KidCareHinoba-an}
APP_ENV=production
APP_KEY=${APP_KEY}
APP_DEBUG=true
APP_URL=${APP_URL:-http://localhost}
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US
APP_MAINTENANCE_DRIVER=file
PHP_CLI_SERVER_WORKERS=8
BCRYPT_ROUNDS=12
LOG_CHANNEL=stderr
LOG_LEVEL=error
DB_CONNECTION=pgsql
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT:-5432}
DB_DATABASE=${DB_DATABASE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=
SESSION_SECURE_COOKIE=false
SESSION_SAME_SITE=lax
SESSION_COOKIE=brgy2dms_session
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
CACHE_STORE=database
MAIL_MAILER=resend
MAIL_FROM_ADDRESS=${MAIL_FROM_ADDRESS:-onboarding@resend.dev}
MAIL_FROM_NAME="KidCare Hinoba-an"
RESEND_API_KEY=${RESEND_API_KEY:-}
VITE_APP_NAME=\${APP_NAME}
ADMIN_REGISTER_KEY=${ADMIN_REGISTER_KEY:-Brgy2DMS@AdminKey2024}
EOF

# Parse DATABASE_URL if set
if [ -n "$DATABASE_URL" ]; then
    DB_USER=$(echo "$DATABASE_URL" | sed -E 's|.*://([^:]+):.*|\1|')
    DB_PASS=$(echo "$DATABASE_URL" | sed -E 's|.*://[^:]+:([^@]+)@.*|\1|')
    DB_HOST_PARSED=$(echo "$DATABASE_URL" | sed -E 's|.*@([^:/]+)[:/].*|\1|')
    DB_PORT_PARSED=$(echo "$DATABASE_URL" | sed -E 's|.*@[^:]+:([0-9]+)/.*|\1|')
    DB_NAME=$(echo "$DATABASE_URL" | sed -E 's|.*/([^?]+).*|\1|')
    sed -i "s|^DB_HOST=.*|DB_HOST=${DB_HOST_PARSED}|" /app/.env
    sed -i "s|^DB_PORT=.*|DB_PORT=${DB_PORT_PARSED}|" /app/.env
    sed -i "s|^DB_DATABASE=.*|DB_DATABASE=${DB_NAME}|" /app/.env
    sed -i "s|^DB_USERNAME=.*|DB_USERNAME=${DB_USER}|" /app/.env
    sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=${DB_PASS}|" /app/.env
    echo "DB configured: host=${DB_HOST_PARSED} db=${DB_NAME}"
fi

# Storage setup
mkdir -p /app/storage/app/public/enrollment_photos
mkdir -p /app/storage/app/public/profile_pictures
mkdir -p /app/storage/framework/sessions
mkdir -p /app/storage/framework/views
mkdir -p /app/storage/framework/cache
mkdir -p /app/storage/logs
chmod -R 777 /app/storage
chmod -R 777 /app/bootstrap/cache
rm -f /app/public/storage
ln -sfn /app/storage/app/public /app/public/storage
echo "Storage ready"

# Migrate
php artisan migrate --force && echo "Migrations done" || echo "Migration warning (may already be up to date)"

# Seed welcome content
php artisan db:seed --class=WelcomeContentSeeder --force 2>/dev/null && echo "Seeded" || true

# Cache config and routes only (no view:cache)
php artisan config:cache && echo "Config cached"
php artisan route:cache && echo "Routes cached"

# Create Laravel router for php -S
cat > /app/server.php << 'ROUTER'
<?php
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$publicPath = __DIR__.'/public';
if ($uri !== '/' && file_exists($publicPath.$uri)) {
    return false;
}
require_once $publicPath.'/index.php';
ROUTER

echo "=== DCMS Ready on port ${PORT:-8080} ==="
exec php -S 0.0.0.0:${PORT:-8080} -t /app/public /app/server.php
