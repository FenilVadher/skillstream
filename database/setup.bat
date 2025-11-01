@echo off
REM ============================================
REM AI Training Management System - Database Setup Script (Windows)
REM ============================================

echo.
echo Starting Database Setup...
echo.

REM Database configuration
set DB_NAME=training_management_db
set DB_USER=root

REM Prompt for MySQL password
set /p DB_PASSWORD="Enter MySQL root password: "
echo.

REM Test MySQL connection
echo Testing MySQL connection...
mysql -u%DB_USER% -p%DB_PASSWORD% -e "SELECT 1;" >nul 2>&1

if errorlevel 1 (
    echo Failed to connect to MySQL. Please check your credentials.
    pause
    exit /b 1
)

echo MySQL connection successful!
echo.

REM Create database and schema
echo Creating database and tables...
mysql -u%DB_USER% -p%DB_PASSWORD% < schema.sql

if errorlevel 1 (
    echo Failed to create database schema.
    pause
    exit /b 1
)

echo Database schema created successfully!
echo.

REM Insert seed data
echo Inserting seed data...
mysql -u%DB_USER% -p%DB_PASSWORD% < seed.sql

if errorlevel 1 (
    echo Failed to insert seed data.
    pause
    exit /b 1
)

echo Seed data inserted successfully!
echo.
echo Database setup completed successfully!
echo.
echo Database Details:
echo   - Database Name: %DB_NAME%
echo   - Tables Created: 11
echo   - Default Badges: 6
echo.
echo Next Steps:
echo   1. Update backend\.env with your database credentials
echo   2. Start the backend server: cd backend ^&^& npm run dev
echo   3. Register admin and trainee users through the application
echo.
pause
