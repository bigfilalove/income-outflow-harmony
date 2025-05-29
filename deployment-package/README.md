
# Finance Tracker - Локальная установка

## 🎯 Описание
Finance Tracker - это автономная система управления финансами, предназначенная для локального развертывания на сервере клиента. Система обеспечивает полную автономность и контроль над финансовыми данными.

## ✨ Особенности
- **Полная автономность**: Никаких внешних зависимостей
- **Локальная база данных MongoDB**: Все данные хранятся локально
- **JWT-аутентификация**: Безопасная система входа
- **Docker развертывание**: Простая установка и управление
- **Веб-интерфейс**: Современный интуитивный интерфейс

## 🚀 Быстрая установка

### Системные требования
- **Операционная система**: Windows 10+, Ubuntu 18.04+, CentOS 7+
- **RAM**: Минимум 2 ГБ, рекомендуется 4 ГБ
- **Диск**: 10 ГБ свободного места
- **Docker**: Версия 20.10+
- **Docker Compose**: Версия 2.0+

### Автоматическая установка

**Linux/Unix системы:**
```bash
chmod +x install-linux.sh
./install-linux.sh
```

**Windows:**
```cmd
install-windows.bat
```

### Ручная установка

1. **Установите Docker и Docker Compose**
   - [Docker для Windows](https://www.docker.com/products/docker-desktop/)
   - [Docker для Linux](https://docs.docker.com/engine/install/)

2. **Создайте рабочую директорию**
   ```bash
   mkdir finance-tracker && cd finance-tracker
   ```

3. **Скопируйте файлы проекта**
   Распакуйте все файлы в рабочую директорию

4. **Запустите установку**
   ```bash
   docker-compose up -d
   ```

## 🔧 Конфигурация

### Переменные окружения (.env)
```env
NODE_ENV=production
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/finance_tracker?authSource=admin
JWT_SECRET=ваш-секретный-ключ-здесь
PORT=3000
```

### Настройка базы данных
- **База данных**: finance_tracker
- **Пользователь**: admin
- **Пароль**: admin123 (обязательно измените!)
- **Порт**: 27017

## 👤 Вход в систему

После установки система доступна по адресу: `http://localhost:3000`

**Данные администратора:**
- Логин: `admin`
- Пароль: `admin123`

⚠️ **ВАЖНО**: Обязательно смените пароль администратора сразу после первого входа!

## 📊 Функциональность

### Основные возможности
- **Управление транзакциями**: Доходы, расходы, переводы
- **Бюджетирование**: Планирование и контроль бюджета
- **Аналитика**: Отчеты и графики
- **Управление компаниями**: Мульти-компанийная структура
- **Управление проектами**: Распределение по проектам
- **Инвестиции**: Учет инвестиционных операций

### Роли пользователей
- **Администратор**: Полный доступ к системе
- **Пользователь**: Стандартные функции
- **Базовый**: Ограниченный доступ

## 🛠️ Управление системой

### Полезные команды
```bash
# Просмотр статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f

# Остановка системы
docker-compose down

# Перезапуск
docker-compose restart

# Обновление
docker-compose pull && docker-compose up -d
```

### Резервное копирование
```bash
# Создание резервной копии
docker exec finance-tracker-mongodb mongodump --db finance_tracker --gzip --archive > backup-$(date +%Y%m%d).gz

# Восстановление
docker exec -i finance-tracker-mongodb mongorestore --db finance_tracker --gzip --archive < backup-20240101.gz
```

## 🔐 Безопасность

### Рекомендации для production
1. **Смените все пароли по умолчанию**
2. **Используйте сложный JWT-ключ**
3. **Настройте файрвол**
4. **Включите HTTPS через reverse proxy**
5. **Регулярные резервные копии**

### Пример конфигурации Nginx
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🆘 Поддержка и устранение неисправностей

### Частые проблемы

**Порт 3000 занят:**
```bash
# Измените порт в .env файле
PORT=3001
```

**Проблемы с MongoDB:**
```bash
# Проверка логов MongoDB
docker-compose logs mongodb

# Перезапуск MongoDB
docker-compose restart mongodb
```

**Приложение не запускается:**
```bash
# Проверка логов приложения
docker-compose logs finance-tracker

# Пересборка
docker-compose up --build -d
```

### Проверка состояния
- Веб-интерфейс: `http://localhost:3000`
- Проверка здоровья: `http://localhost:3000/health`
- Логи: `docker-compose logs`

## 📝 Лицензия
Программное обеспечение предоставляется как есть для локального развертывания. Убедитесь в соответствии политикам безопасности вашей организации.

## 🔄 Обновления
Для получения обновлений обратитесь к поставщику системы. Рекомендуется регулярно проверять наличие обновлений безопасности.
