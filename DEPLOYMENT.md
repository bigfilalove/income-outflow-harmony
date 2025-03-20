
# Руководство по развертыванию проекта

## Требования к серверу

- Node.js версии 16 или выше
- NPM версии 7 или выше
- Минимум 2 ГБ оперативной памяти
- 1 ГБ свободного места на диске

## Шаги по развертыванию

### 1. Подготовка проекта к сборке

```bash
# Установка зависимостей
npm install

# Сборка проекта
npm run build
```

### 2. Развертывание на сервере

После сборки проекта в директории `dist` будут находиться все необходимые файлы для развертывания.

#### Вариант 1: Использование Nginx

Пример конфигурации Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/project/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Кэширование статических ресурсов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

#### Вариант 2: Использование Apache

Создайте файл `.htaccess` в корне директории `dist`:

```htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Кэширование статических ресурсов
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-javascript "access plus 1 month"
  ExpiresByType application/x-shockwave-flash "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresDefault "access plus 2 days"
</IfModule>
```

### 3. Настройка среды выполнения

Если в вашем приложении используются переменные окружения, создайте файл `.env` на сервере или настройте соответствующие переменные окружения в системе.

### 4. Проверка развертывания

После развертывания проверьте работоспособность приложения, убедитесь, что все функции работают корректно и нет ошибок в консоли браузера.

## Обновление приложения

Для обновления приложения повторите шаги по сборке проекта и замените файлы на сервере новыми версиями.

## Резервное копирование

Рекомендуется регулярно создавать резервные копии приложения и данных для предотвращения потери информации.
