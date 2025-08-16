# 🔮 Mystical Astro Server

Астрологический сервис с персональными рекомендациями, построенный на NestJS с модульной архитектурой.

## 🎯 Цель проекта

Выдавать персональные рекомендации на основе астрологических данных:
- Уровень энергии дня
- Ритуал дня
- Напоминания и уведомления
- Рецепты настоев
- Камни дня
- Астрологический путь развития

## 🏗️ Архитектура

### Технологический стек
- **Core API**: TypeScript + NestJS
- **ORM**: Prisma (PostgreSQL)
- **База данных**: PostgreSQL 15+
- **Кэш**: Redis
- **Очереди**: BullMQ + Redis
- **Планировщик**: Nest Schedule
- **Аутентификация**: JWT + Magic Link
- **Астрологические расчеты**: Swiss Ephemeris

### Модульная структура
```
src/
├── common/           # Общие сервисы
│   ├── database/    # Prisma + PostgreSQL
│   ├── redis/       # Redis кэш
│   ├── email/       # Email сервис
│   └── storage/     # S3/MinIO
├── modules/          # Основные модули
│   ├── auth/        # Аутентификация
│   ├── users/       # Пользователи
│   ├── astro/       # Астрология
│   ├── energy-engine/ # Энергетический движок
│   ├── recommender/ # Рекомендации
│   ├── rituals/     # Ритуалы
│   ├── journal/     # Дневник
│   └── ...          # Другие модули
```

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- PostgreSQL 15+
- Redis 6+
- Docker (опционально)

### 1. Клонирование и установка
```bash
git clone <repository-url>
cd MysticalAsttoServer
npm install
```

### 2. Настройка окружения
```bash
cp env.example .env
# Отредактируйте .env файл с вашими настройками
```

### 3. Настройка базы данных
```bash
# Создайте базу данных PostgreSQL
createdb mystical_astro

# Примените миграции
npm run prisma:migrate

# Сгенерируйте Prisma клиент
npm run prisma:generate
```

### 4. Запуск Redis
```bash
# Локально
redis-server

# Или через Docker
docker run -d -p 6379:6379 redis:6-alpine
```

### 5. Запуск приложения
```bash
# Режим разработки
npm run start:dev

# Продакшн
npm run build
npm run start:prod
```

## 📊 API Endpoints

### Аутентификация
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход
- `POST /auth/magic-link` - Отправка magic link
- `GET /auth/magic-link/verify` - Подтверждение magic link
- `POST /auth/refresh` - Обновление токена

### Пользователи
- `GET /users/profile` - Профиль текущего пользователя
- `PATCH /users/profile` - Обновление профиля
- `GET /users/:id` - Получение пользователя по ID

### Астрология
- `GET /astro/moon/current` - Текущая лунная фаза
- `GET /astro/moon/date?date=2024-01-15` - Лунная фаза для даты
- `GET /astro/influences/today` - Астрологические влияния на сегодня

### Энергетический движок
- `GET /energy/today` - Энергетический показатель на сегодня
- `GET /energy/history?days=30` - История энергетических показателей

## 🔧 Конфигурация

### Переменные окружения
```bash
# База данных
DATABASE_URL="postgresql://username:password@localhost:5432/mystical_astro"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Приложение
APP_PORT=3000
APP_ENV="development"
```

## 📅 Планировщик задач

### Автоматические задачи
- **03:00** - Обновление астрологических данных
- **04:00** - Расчет daily energy score для всех пользователей
- **05:00** - Генерация рекомендаций дня

## 🧪 Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Покрытие кода
npm run test:cov
```

## 📚 Swagger документация

После запуска приложения документация доступна по адресу:
```
http://localhost:3000/api
```

## 🚀 Развертывание

### Docker
```bash
# Сборка образа
docker build -t mystical-astro .

# Запуск контейнера
docker run -p 3000:3000 mystical-astro
```

### Docker Compose
```bash
docker-compose up -d
```

## 🔮 Основные функции

### 1. Энергетический движок
- Расчет daily energy score на основе:
  - Лунных фаз
  - Знака зодиака пользователя
  - Элемента (огонь/земля/воздух/вода)
  - Времени года и дня недели

### 2. Астрологические расчеты
- Точные лунные фазы через Swiss Ephemeris
- Влияния на разные сферы жизни
- Рекомендации по активности

### 3. Персональные рекомендации
- Ритуал дня
- Камень дня
- Рецепт настоя
- Энергетические советы

### 4. Система достижений
- Отслеживание прогресса
- Бейджи и достижения
- Streaks и статистика

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект находится под лицензией MIT. См. файл `LICENSE` для деталей.

## 🆘 Поддержка

Если у вас есть вопросы или проблемы:
- Создайте Issue в GitHub
- Обратитесь к документации API
- Проверьте логи приложения

## 🔮 Будущие улучшения

- [ ] ML-модели для рекомендаций
- [ ] Интеграция с ClickHouse для аналитики
- [ ] Микросервисная архитектура
- [ ] GraphQL API
- [ ] Мобильное приложение
- [ ] Интеграция с календарями
- [ ] Социальные функции

---

**Создано с ❤️ для астрологического сообщества**
