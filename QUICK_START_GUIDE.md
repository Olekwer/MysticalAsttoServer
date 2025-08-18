# Quick Start Guide - Mystical Astro Server

##  Быстрый старт за 5 минут

### 1. Запуск приложения
```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run start:dev
```

**Результат**: Приложение запустится на порту 3010 с сообщением:
```
🚀 Application started on port 3010
📚 Swagger documentation available at: http://localhost:3010/api
```

### 2. Заполнение базы данных (mock)
```bash
# Mock seed - работает без реальной базы данных
npm run db:seed:mock

# Реальный seed - требует PostgreSQL
npm run db:seed
```

**Результат mock seed**:
```
🌱 Starting mock database seeding...
✅ Mock ritual tags created: 9
✅ Mock rituals created: 4
✅ Mock stones created: 4
✅ Mock tea recipes created: 3
✅ Mock users created: 2
✅ Mock energy scores created: 2
✅ Mock recommendations created: 2
🎉 Mock database successfully seeded!
```

### 3. Проверка работоспособности
```bash
# Health check
curl http://localhost:3010/health

# Swagger документация
open http://localhost:3010/api
```

## Основные API endpoints

### Аутентификация
```bash
# Регистрация
curl -X POST http://localhost:3010/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "zodiacSign": "leo",
    "element": "fire"
  }'

# Вход
curl -X POST http://localhost:3010/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Получение данных (требует JWT токен)
```bash
# Энергетический показатель на сегодня
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3010/energy/today

# Рекомендации на сегодня
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3010/recommendations/today

# Астрологические влияния
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3010/astro/influences/today
```

## 📊 Что происходит при запуске

### Автоматические задачи (Cron jobs):
- **03:00** - Обновление астрологических данных
- **04:00** - Расчет энергетических показателей
- **05:00** - Генерация рекомендаций

### Основные модули:
1. **Energy Engine** - рассчитывает энергетический показатель (0-100)
2. **Recommender** - генерирует персональные рекомендации
3. **Astro Service** - астрологические расчеты и влияния
4. **Journal** - отслеживание прогресса пользователя

## 🧪 Тестирование

### Unit тесты
```bash
npm run test
```

### E2E тесты
```bash
npm run test:e2e
```

### Покрытие кода
```bash
npm run test:cov
```

## 🔧 Конфигурация

### Переменные окружения (.env):
```bash
# База данных (сейчас отключена - используется mock)
DATABASE_URL="postgresql://user:pass@localhost:5432/mystical_astro"

# Redis (сейчас отключен - используется mock)
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# Приложение
APP_PORT=3010
APP_ENV="development"
```

## 📁 Структура проекта

```
src/
├── modules/           # Основные модули
│   ├── auth/         # Аутентификация
│   ├── energy-engine/ # Энергетический движок
│   ├── recommender/  # Система рекомендаций
│   └── astro/        # Астрологические расчеты
├── common/            # Общие сервисы
│   ├── database/     # Prisma (сейчас mock)
│   ├── redis/        # Redis (сейчас mock)
│   └── email/        # Email сервис
└── main.ts           # Точка входа
```

## 🚨 Текущие ограничения

### Mock сервисы (для разработки):
- **База данных**: Все операции логируются, но не сохраняются
- **Redis**: In-memory кэш (сбрасывается при перезапуске)
- **RabbitMQ**: Операции логируются, но не выполняются
- **I18n**: Отключен, используется английский язык

### Mock данные:
- **Seed**: `npm run db:seed:mock` - создает тестовые данные в памяти
- **Содержимое**: 9 тегов ритуалов, 4 ритуала, 4 камня, 3 рецепта чая, 2 пользователя
- **Сброс**: Данные сбрасываются при перезапуске приложения

### Для продакшена нужно:
1. Настроить PostgreSQL
2. Включить Redis
3. Настроить RabbitMQ
4. Включить I18n модуль

## 🔍 Отладка

### Логи приложения:
```bash
# Просмотр логов в реальном времени
npm run start:dev

# Логи показывают:
# - Инициализацию модулей
# - Mock сервисы (⚠️ Database not available, using mock service)
# - API запросы
# - Cron job выполнение
```

### Swagger UI:
- **URL**: http://localhost:3010/api
- **Возможности**: Тестирование API, документация, схемы

## Дополнительные ресурсы

- **Полная документация**: `PROJECT_DOCUMENTATION.md`
- **README**: `README.md`
- **Swagger**: http://localhost:3010/api
- **Health check**: http://localhost:3010/health

## 🆘 Решение проблем

### Приложение не запускается:
1. Проверьте порт 3010 (не занят ли)
2. Убедитесь, что все зависимости установлены
3. Проверьте логи на наличие ошибок

### API возвращает ошибки:
1. Проверьте JWT токен в заголовке Authorization
2. Убедитесь, что endpoint существует в Swagger
3. Проверьте формат данных в запросе

### Mock сервисы:
- Это нормально для разработки
- Все операции логируются в консоль
- Данные не сохраняются между перезапусками

---

**Готово к разработке! 🎉**
