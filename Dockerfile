FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git curl zip unzip libpq-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs && apt-get clean

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build && npm prune --omit=dev

RUN mkdir -p storage/framework/{sessions,views,cache,testing} \
    storage/logs bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

EXPOSE 8080

# Write startup script
RUN echo '#!/bin/sh' > /start.sh \
    && echo 'set -e' >> /start.sh \
    && echo 'echo "=== Starting DCMS ==="' >> /start.sh \
    && echo 'chmod -R 777 /app/storage' >> /start.sh \
    && echo 'mkdir -p /app/storage/app/public/enrollment_photos' >> /start.sh \
    && echo 'mkdir -p /app/storage/app/public/profile_pictures' >> /start.sh \
    && echo 'php artisan config:clear' >> /start.sh \
    && echo 'php artisan route:clear' >> /start.sh \
    && echo 'php artisan view:clear' >> /start.sh \
    && echo 'php artisan config:cache' >> /start.sh \
    && echo 'php artisan route:cache' >> /start.sh \
    && echo 'php artisan view:cache' >> /start.sh \
    && echo 'php artisan migrate --force' >> /start.sh \
    && echo 'php artisan storage:link --force' >> /start.sh \
    && echo 'echo "=== DCMS Ready ==="' >> /start.sh \
    && echo 'php artisan serve --host=0.0.0.0 --port=${PORT:-8080}' >> /start.sh \
    && chmod +x /start.sh

CMD ["/start.sh"]
