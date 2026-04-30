@echo off
echo ========================================
echo Brgy2DMS - Starting Application
echo ========================================
echo.
echo Database: SQLite (Ready!)
echo Frontend: Production Build
echo.
echo IMPORTANT: Make sure you have run 'npm run build' first!
echo.
echo Starting Laravel server...
echo.
echo Application will be available at:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

php artisan serve
