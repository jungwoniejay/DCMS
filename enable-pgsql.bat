@echo off
echo ========================================
echo Enabling PostgreSQL Support in PHP
echo ========================================
echo.

echo Backing up php.ini...
copy C:\xampp\php\php.ini C:\xampp\php\php.ini.backup
echo Backup created: C:\xampp\php\php.ini.backup
echo.

echo Enabling PostgreSQL extensions...

powershell -Command "(Get-Content C:\xampp\php\php.ini) -replace ';extension=pdo_pgsql', 'extension=pdo_pgsql' | Set-Content C:\xampp\php\php.ini"
powershell -Command "(Get-Content C:\xampp\php\php.ini) -replace ';extension=pgsql', 'extension=pgsql' | Set-Content C:\xampp\php\php.ini"

echo.
echo PostgreSQL extensions enabled!
echo.

echo Verifying installation...
php -m | findstr pgsql
echo.

if %errorlevel% equ 0 (
    echo SUCCESS: PostgreSQL extensions are now enabled!
    echo.
    echo You can now run your Laravel application.
    echo Run: composer run dev
) else (
    echo ERROR: Extensions not loaded. Please restart your computer and try again.
)

echo.
echo ========================================
echo Done!
echo ========================================
pause
