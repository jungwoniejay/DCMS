@echo off
echo ========================================
echo Barangay Child Development Data Management System
echo Setup Script
echo ========================================
echo.

echo Step 1: Installing Composer dependencies...
call composer install
if %errorlevel% neq 0 (
    echo Error: Composer install failed
    pause
    exit /b 1
)
echo.

echo Step 2: Installing NPM dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: NPM install failed
    pause
    exit /b 1
)
echo.

echo Step 3: Creating PostgreSQL database...
echo Please ensure PostgreSQL is running and credentials in .env are correct
echo Database name: brgy2dms
echo Username: postgres
echo Password: postgres
echo.
echo Press any key to continue after verifying database exists...
pause > nul
echo.

echo Step 4: Running database migrations...
call php artisan migrate:fresh --seed
if %errorlevel% neq 0 (
    echo Error: Migration failed. Please check your database connection.
    pause
    exit /b 1
)
echo.

echo Step 5: Building frontend assets...
call npm run build
if %errorlevel% neq 0 (
    echo Warning: Build failed, but you can use 'npm run dev' for development
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the development server, run:
echo   composer run dev
echo.
echo Or run separately:
echo   php artisan serve
echo   npm run dev
echo.
echo The application will be available at:
echo   http://localhost:8000
echo.
pause
