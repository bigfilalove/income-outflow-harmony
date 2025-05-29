
#!/bin/bash

# Finance Tracker Backup Script
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"

# Create backup directory
mkdir -p $BACKUP_DIR

echo "🔄 Создание резервной копии базы данных..."

# Create MongoDB backup
docker exec finance-tracker-mongodb mongodump \
  --db finance_tracker \
  --gzip \
  --archive > $BACKUP_DIR/finance_tracker_backup_$DATE.gz

if [ $? -eq 0 ]; then
    echo "✅ Резервная копия создана: finance_tracker_backup_$DATE.gz"
    
    # Remove backups older than 30 days
    find $BACKUP_DIR -name "finance_tracker_backup_*.gz" -mtime +30 -delete
    echo "🧹 Старые резервные копии удалены"
else
    echo "❌ Ошибка создания резервной копии"
    exit 1
fi
