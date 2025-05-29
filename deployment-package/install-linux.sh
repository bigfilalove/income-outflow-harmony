
#!/bin/bash

# Finance Tracker - Linux Installation Script
set -e

echo "=== Finance Tracker - Установка для Linux ==="
echo "Устанавливаем Finance Tracker на ваш сервер..."

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не найден. Устанавливаем Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker установлен. Перезайдите в систему для применения изменений."
fi

# Проверка Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не найден. Устанавливаем..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose установлен."
fi

# Создание директорий
echo "📁 Создаем рабочие директории..."
mkdir -p logs data/mongodb

# Установка прав
chmod 755 logs data/mongodb

# Создание .env файла
if [ ! -f .env ]; then
    echo "🔧 Создаем конфигурационный файл..."
    cat > .env << EOL
NODE_ENV=production
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/finance_tracker?authSource=admin
JWT_SECRET=finance-tracker-$(openssl rand -hex 32)
PORT=3000
EOL
    echo "✅ Конфигурация создана с безопасным JWT-ключом"
fi

# Запуск сервисов
echo "🚀 Запускаем сервисы..."
docker-compose up --build -d

# Ожидание запуска
echo "⏳ Ожидаем запуска сервисов..."
sleep 45

# Проверка статуса
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "🎉 Установка завершена успешно!"
    echo ""
    echo "📱 Finance Tracker доступен по адресу: http://localhost:3000"
    echo ""
    echo "👤 Данные администратора по умолчанию:"
    echo "   Логин: admin"
    echo "   Пароль: admin123"
    echo ""
    echo "⚠️  ВАЖНО: Обязательно смените пароль администратора после первого входа!"
    echo ""
    echo "📋 Полезные команды:"
    echo "   Просмотр логов: docker-compose logs -f"
    echo "   Остановка: docker-compose down"
    echo "   Перезапуск: docker-compose restart"
    echo "   Обновление: docker-compose pull && docker-compose up -d"
else
    echo "❌ Установка не удалась. Проверьте логи: docker-compose logs"
    exit 1
fi
