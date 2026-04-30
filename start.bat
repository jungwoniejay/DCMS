@echo off
echo ========================================
echo Starting Brgy2DMS Application
echo ========================================
echo.
echo Database: SQLite (Ready!)
echo Migrations: Complete
echo Sample Data: 3 children loaded
echo.
echo Starting development server...
echo.
echo The application will be available at:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

composer run dev
