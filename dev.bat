@echo off
echo ========================================
echo Brgy2DMS - Starting Development Server
echo ========================================
echo.
echo Starting Laravel and Vite servers...
echo.
echo The application will be available at:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop all servers
echo.
echo ========================================
echo.

start "Laravel Server" cmd /k "php artisan serve"
timeout /t 2 /nobreak >nul
start "Vite Dev Server" cmd /k "npm run dev"

echo.
echo Both servers are starting in separate windows...
echo Close this window or press any key to continue...
pause >nul
