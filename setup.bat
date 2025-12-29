@echo off
REM Text to Learn - Quick Setup Script for Windows

echo ==================================
echo Text to Learn - Quick Setup
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js v16+ first.
    exit /b 1
)

echo + Node.js is installed
node --version
echo.

REM Setup Backend
echo Setting up Backend...
cd server

if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo WARNING: Please update server\.env with your actual API keys and credentials
)

echo Installing backend dependencies...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo + Backend dependencies installed successfully
) else (
    echo X Failed to install backend dependencies
    exit /b 1
)

cd ..

REM Setup Frontend
echo.
echo Setting up Frontend...
cd client

if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo WARNING: Please update client\.env with your Auth0 credentials
)

echo Installing frontend dependencies...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo + Frontend dependencies installed successfully
) else (
    echo X Failed to install frontend dependencies
    exit /b 1
)

cd ..

echo.
echo ==================================
echo + Setup Complete!
echo ==================================
echo.
echo Next steps:
echo 1. Update server\.env with your MongoDB URI, Auth0, Gemini, and YouTube API keys
echo 2. Update client\.env with your Auth0 configuration
echo 3. Start the backend: cd server ^&^& npm run dev
echo 4. Start the frontend: cd client ^&^& npm run dev
echo.
echo For detailed instructions, see SETUP_GUIDE.md
echo.

pause
