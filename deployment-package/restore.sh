
#!/bin/bash

# Finance Tracker Restore Script

if [ -z "$1" ]; then
    echo "❌ Не указан файл резервной копии"
    echo "Использование: ./restore.sh backup_file.gz"
    echo "Пример: ./restore.sh backups/finance_tracker_backup_20240101_120000.gz"
    exit 1
fi

if [ ! -f "$1" ]; then
    echo "❌ Файл резервной копии не найден: $1"
    exit 1
fi

echo "⚠️  ВНИМАНИЕ: Это действие перезапишет текущую базу данных!"
read -p "Продолжить? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "🚫 Восстановление отменено"
    exit 0
fi

echo "🔄 Восстановление базы данных из $1..."

# Restore MongoDB backup
docker exec -i finance-tracker-mongodb mongorestore \
  --db finance_tracker \
  --drop \
  --gzip \
  --archive < "$1"

if [ $? -eq 0 ]; then
    echo "✅ База данных успешно восстановлена"
    echo "🔄 Перезапуск приложения..."
    docker-compose restart finance-tracker
else
    echo "❌ Ошибка восстановления базы данных"
    exit 1
fi
