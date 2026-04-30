@echo off
echo ========================================
echo Brgy2DMS System Verification
echo ========================================
echo.

echo Checking system requirements...
echo.

echo [1/6] Checking PHP...
php --version
if %errorlevel% neq 0 (
    echo ERROR: PHP not found!
    goto :error
)
echo OK: PHP is installed
echo.

echo [2/6] Checking Composer...
composer --version
if %errorlevel% neq 0 (
    echo ERROR: Composer not found!
    goto :error
)
echo OK: Composer is installed
echo.

echo [3/6] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    goto :error
)
echo OK: Node.js is installed
echo.

echo [4/6] Checking NPM...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: NPM not found!
    goto :error
)
echo OK: NPM is installed
echo.

echo [5/6] Checking PostgreSQL...
psql --version
if %errorlevel% neq 0 (
    echo WARNING: PostgreSQL command line tools not found in PATH
    echo Please ensure PostgreSQL is installed and running
) else (
    echo OK: PostgreSQL is installed
)
echo.

echo [6/6] Checking Laravel installation...
if exist "vendor\autoload.php" (
    echo OK: Composer dependencies installed
) else (
    echo WARNING: Composer dependencies not installed
    echo Run: composer install
)
echo.

if exist "node_modules" (
    echo OK: NPM dependencies installed
) else (
    echo WARNING: NPM dependencies not installed
    echo Run: npm install
)
echo.

echo ========================================
echo Checking Database Configuration...
echo ========================================
echo.

if exist ".env" (
    echo OK: .env file exists
    echo.
    echo Current database configuration:
    findstr /B "DB_" .env
) else (
    echo ERROR: .env file not found!
    goto :error
)
echo.

echo ========================================
echo Verification Complete!
echo ========================================
echo.

echo Next steps:
echo 1. Ensure PostgreSQL is running
echo 2. Create database: CREATE DATABASE brgy2dms;
echo 3. Run setup: setup.bat
echo 4. Start server: composer run dev
echo.
goto :end

:error
echo.
echo ========================================
echo Verification Failed!
echo ========================================
echo Please install missing requirements and try again.
echo.

:end
pause
