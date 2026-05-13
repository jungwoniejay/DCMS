#!/bin/sh
set -e

echo "=== Starting DCMS ==="

# AGGRESSIVELY clear ALL cached files that may persist on volume
rm -rf /app/bootstrap/cache/*.php
rm -rf /app/storage/framework/views/*.php
rm -rf /app/storage/framework/cache/data/*
echo "All caches cleared"

# Always regenerate .env from Railway environment variables
cat > /app/.env << EOF
APP_NAME=${APP_NAME:-KidCareHinoba-an}
APP_ENV=production
APP_KEY=${APP_KEY}
APP_DEBUG=false
APP_URL=${APP_URL:-http://localhost}
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US
APP_MAINTENANCE_DRIVER=file
PHP_CLI_SERVER_WORKERS=4
BCRYPT_ROUNDS=12
LOG_CHANNEL=stderr
LOG_LEVEL=debug
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
    DB_HOST=$(echo "$DATABASE_URL" | sed -E 's|.*@([^:/]+)[:/].*|\1|')
    DB_PORT=$(echo "$DATABASE_URL" | sed -E 's|.*@[^:]+:([0-9]+)/.*|\1|')
    DB_NAME=$(echo "$DATABASE_URL" | sed -E 's|.*/([^?]+).*|\1|')
    sed -i "s|^DB_HOST=.*|DB_HOST=${DB_HOST}|" /app/.env
    sed -i "s|^DB_PORT=.*|DB_PORT=${DB_PORT}|" /app/.env
    sed -i "s|^DB_DATABASE=.*|DB_DATABASE=${DB_NAME}|" /app/.env
    sed -i "s|^DB_USERNAME=.*|DB_USERNAME=${DB_USER}|" /app/.env
    sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=${DB_PASS}|" /app/.env
    echo "DB configured: host=${DB_HOST} db=${DB_NAME}"
fi

# Storage setup
mkdir -p /tmp/sessions
chmod -R 777 /tmp/sessions
chmod -R 777 /app/storage/app/public 2>/dev/null || true
mkdir -p /app/storage/app/public/enrollment_photos
mkdir -p /app/storage/app/public/profile_pictures
rm -f /app/public/storage
ln -sfn /app/storage/app/public /app/public/storage

# Run migrations and seed default content
php artisan migrate --force
php artisan db:seed --class=WelcomeContentSeeder --force

echo "=== DCMS Ready on port ${PORT:-8080} ==="
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
