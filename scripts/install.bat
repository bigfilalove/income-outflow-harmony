
@echo off
echo === Finance Tracker Local Installation ===

REM Check if Docker is installed
docker --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Docker is not installed. Please install Docker first.
    echo Visit: https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Docker Compose is not installed. Please install Docker Compose first.
    echo Visit: https://docs.docker.com/compose/install/
    pause
    exit /b 1
)

REM Create necessary directories
echo Creating directories...
if not exist logs mkdir logs
if not exist data mkdir data
if not exist data\mongodb mkdir data\mongodb

REM Copy environment file
if not exist .env (
    echo Creating .env file...
    (
        echo NODE_ENV=production
        echo MONGODB_URI=mongodb://admin:admin123@mongodb:27017/finance_tracker?authSource=admin
        echo JWT_SECRET=finance-tracker-secure-secret-key-change-this
        echo PORT=3000
    ) > .env
    echo .env file created
)

REM Build and start services
echo Building and starting services...
docker-compose up --build -d

REM Wait for services to be ready
echo Waiting for services to start...
timeout /t 30 /nobreak

REM Check if services are running
docker-compose ps | findstr "Up" >nul
if %ERRORLEVEL% equ 0 (
    echo.
    echo ✅ Installation completed successfully!
    echo.
    echo 🎉 Finance Tracker is now running on: http://localhost:3000
    echo.
    echo Default admin credentials:
    echo Username: admin
    echo Password: admin123
    echo.
    echo Useful commands:
    echo   View logs: docker-compose logs -f
    echo   Stop services: docker-compose down
    echo   Restart services: docker-compose restart
    echo   Update application: docker-compose pull ^&^& docker-compose up -d
) else (
    echo ❌ Installation failed. Check logs with: docker-compose logs
    pause
    exit /b 1
)

pause
