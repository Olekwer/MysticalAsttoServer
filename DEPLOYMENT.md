# Инструкции по деплою Mystical Astro API

## Подготовка к деплою

### 1. Настройка переменных окружения

Создайте файл `.env` на сервере на основе `config.example.env`:

```bash
# Скопируйте и настройте переменные
cp config.example.env .env
```

**Обязательно настройте:**
- `DATABASE_URL` - подключение к PostgreSQL
- `JWT_SECRET` - секретный ключ для JWT (используйте сильный пароль)
- `ALLOWED_ORIGINS` - ваши фронтенд домены (через запятую)
- `OPENAI_API_KEY` - ключ OpenAI API
- `NODE_ENV=production`

### 2. CORS конфигурация для удаленных доменов

В переменной `ALLOWED_ORIGINS` укажите все домены, с которых будут приходить запросы:

```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com
```

## Способы деплоя

### Вариант 1: Деплой с PM2 (рекомендуется)

```bash
# 1. Установите зависимости
npm install

# 2. Соберите проект
npm run deploy:build

# 3. Выполните миграции базы данных
npm run prisma:migrate:prod

# 4. Запустите с PM2
npm run start:pm2

# Управление PM2
npm run stop:pm2    # Остановить
npm run restart:pm2 # Перезапустить
pm2 logs           # Логи
pm2 status         # Статус
```

### Вариант 2: Docker деплой

```bash
# 1. Соберите Docker образ
npm run deploy:docker

# 2. Запустите контейнер
npm run deploy:docker:run

# Или с custom командой
docker run -d \
  --name mystical-astro-api \
  -p 3010:3010 \
  --env-file .env \
  --restart unless-stopped \
  mystical-astro-api
```

### Вариант 3: Простой запуск

```bash
# 1. Установите зависимости
npm install

# 2. Соберите проект
npm run build

# 3. Выполните миграции
npm run prisma:migrate:prod

# 4. Запустите
npm run start:prod
```

## Проверка деплоя

После деплоя проверьте:

1. **API доступен:**
   ```bash
   curl http://your-server:3010/health
   ```

2. **Swagger документация:**
   ```
   http://your-server:3010/api
   ```

3. **CORS работает:**
   ```bash
   curl -H "Origin: https://yourdomain.com" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: X-Requested-With" \
        -X OPTIONS \
        http://your-server:3010/api/users
   ```

## Настройка Nginx (опционально)

Для продакшена рекомендуется использовать Nginx как reverse proxy:

```nginx
server {
    listen 80;
    server_name your-api-domain.com;

    location / {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Мониторинг

- **PM2 мониторинг:** `pm2 monit`
- **Логи:** `pm2 logs mystical-astro-api`
- **Health check:** `GET /health`

## Безопасность

1. Используйте HTTPS в продакшене
2. Настройте firewall (только нужные порты)
3. Регулярно обновляйте зависимости
4. Используйте сильные пароли для JWT_SECRET
5. Ограничьте CORS только нужными доменами

## Troubleshooting

### Проблемы с CORS
- Проверьте `ALLOWED_ORIGINS` в .env
- Убедитесь что домен указан с протоколом (https://)
- Проверьте что нет лишних пробелов

### Проблемы с базой данных
- Проверьте `DATABASE_URL`
- Выполните миграции: `npm run prisma:migrate:prod`
- Проверьте подключение к PostgreSQL

### Проблемы с портами
- Убедитесь что порт 3010 свободен
- Проверьте настройки firewall
- Используйте `netstat -tulpn | grep 3010`
