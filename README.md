# Mystical Astro Server

Сервер для астрологического сервиса с персональными рекомендациями, построенный на NestJS.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
# или
yarn install
```

### 2. Настройка переменных окружения
```bash
cp env.example .env
```

Отредактируйте `.env` файл, указав ваши настройки для:
- Базы данных PostgreSQL
- Redis
- RabbitMQ
- JWT ключи
- SMTP настройки
- AWS S3 (или MinIO)
- Stripe

### 3. Настройка CORS для фронтенда
Убедитесь, что в `.env` файле настроен CORS для фронтенда:
```env
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
```

### 4. Запуск базы данных
```bash
docker-compose up -d
```

### 5. Миграции и сид данных
```bash
npm run prisma:migrate
npm run prisma:seed
```

### 6. Запуск сервера
```bash
npm run start:dev
# или
yarn start:dev
```

Сервер будет доступен на `http://localhost:3010`

## 🌐 CORS настройка

Для работы с фронтендом на `http://localhost:5173` убедитесь, что в `.env` файле настроен CORS:

```env
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
```

### Тестирование CORS
```bash
./test-cors.sh
```

## 📚 API документация

Swagger документация доступна по адресу: `http://localhost:3010/api`

## 🔧 Основные команды

```bash
# Разработка
npm run start:dev

# Продакшн
npm run start:prod

# Миграции
npm run prisma:migrate
npm run prisma:seed

# Тесты
npm run test
npm run test:e2e
```

## 📁 Структура проекта

```
src/
├── modules/           # Основные модули
│   ├── auth/         # Аутентификация
│   ├── users/        # Пользователи
│   ├── astro/        # Астрологические расчеты
│   ├── content/      # Контент
│   └── ...
├── common/            # Общие утилиты
├── config/            # Конфигурация
└── main.ts            # Точка входа
```

## 🐳 Docker

```bash
# Запуск всех сервисов
docker-compose up -d

# Остановка
docker-compose down

# Просмотр логов
docker-compose logs -f
```

## 🔍 Отладка

### Логи
```bash
# Логи приложения
npm run start:dev

# Логи Docker
docker-compose logs -f app
```

### База данных
```bash
# Подключение к PostgreSQL
docker exec -it mystical-astro-postgres psql -U postgres -d mystical_astro

# Просмотр таблиц
\dt
```

## 🚨 Устранение неполадок

### CORS ошибки
1. Проверьте переменную `ALLOWED_ORIGINS` в `.env`
2. Перезапустите сервер
3. Используйте `./test-cors.sh` для диагностики

### Проблемы с базой данных
1. Убедитесь, что PostgreSQL запущен: `docker-compose ps`
2. Проверьте подключение: `npm run prisma:studio`
3. Выполните миграции: `npm run prisma:migrate`

### Проблемы с Redis/RabbitMQ
1. Проверьте статус сервисов: `docker-compose ps`
2. Просмотрите логи: `docker-compose logs redis rabbitmq`
