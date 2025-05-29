
@echo off
chcp 65001 >nul
echo === Finance Tracker - Установка для Windows ===
echo Устанавливаем Finance Tracker на ваш сервер...

REM Проверка Docker
docker --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker не найден. Пожалуйста, установите Docker Desktop.
    echo 🌐 Скачайте с: https://www.docker.com/products/docker-desktop/
    echo 📝 После установки Docker перезапустите этот скрипт.
    pause
    exit /b 1
)

REM Проверка Docker Compose
docker-compose --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker Compose не найден. Установите Docker Desktop с Compose.
    pause
    exit /b 1
)

REM Создание директорий
echo 📁 Создаем рабочие директории...
if not exist logs mkdir logs
if not exist data mkdir data
if not exist data\mongodb mkdir data\mongodb

REM Создание .env файла
if not exist .env (
    echo 🔧 Создаем конфигурационный файл...
    (
        echo NODE_ENV=production
        echo MONGODB_URI=mongodb://admin:admin123@mongodb:27017/finance_tracker?authSource=admin
        echo JWT_SECRET=finance-tracker-secure-secret-key-production-change-this
        echo PORT=3000
    ) > .env
    echo ✅ Конфигурация создана
)

REM Запуск сервисов
echo 🚀 Запускаем сервисы...
docker-compose up --build -d

REM Ожидание запуска
echo ⏳ Ожидаем запуска сервисов...
timeout /t 45 /nobreak >nul

REM Проверка статуса
docker-compose ps | findstr "Up" >nul
if %ERRORLEVEL% equ 0 (
    echo.
    echo 🎉 Установка завершена успешно!
    echo.
    echo 📱 Finance Tracker доступен по адресу: http://localhost:3000
    echo.
    echo 👤 Данные администратора по умолчанию:
    echo    Логин: admin
    echo    Пароль: admin123
    echo.
    echo ⚠️  ВАЖНО: Обязательно смените пароль администратора после первого входа!
    echo.
    echo 📋 Полезные команды:
    echo    Просмотр логов: docker-compose logs -f
    echo    Остановка: docker-compose down
    echo    Перезапуск: docker-compose restart
    echo    Обновление: docker-compose pull ^&^& docker-compose up -d
) else (
    echo ❌ Установка не удалась. Проверьте логи: docker-compose logs
    pause
    exit /b 1
)

pause
