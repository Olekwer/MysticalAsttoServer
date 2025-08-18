# Проект Mystical Astro Server!

## 📋 Что было создано

### 🏗️ Архитектура
- ✅ Модульная структура NestJS
- ✅ Prisma ORM с PostgreSQL
- ✅ Redis для кэширования
- ✅ RabbitMQ для очередей
- ✅ BullMQ для планировщика задач
- ✅ JWT аутентификация + Magic Link
- ✅ Swiss Ephemeris для астрологических расчетов

### 🔧 Основные модули
- ✅ **Auth** - Регистрация, вход, JWT, Magic Link
- ✅ **Users** - Профили пользователей, знаки зодиака, элементы
- ✅ **Astro** - Лунные фазы, астрологические влияния
- ✅ **Energy Engine** - Расчет daily energy score
- ✅ **Recommender** - Персональные рекомендации
- ✅ **Content** - Ритуалы, камни, рецепты настоев
- ✅ **Rituals** - Управление ритуалами
- ✅ **Journal** - Личный дневник
- ✅ **Progress** - Отслеживание прогресса
- ✅ **Subscriptions** - Премиум подписки
- ✅ **Notifications** - Уведомления
- ✅ **Analytics** - Аналитика и метрики

### 🚀 Инфраструктура
- ✅ Docker Compose для всех сервисов
- ✅ GitHub Actions CI/CD
- ✅ ESLint + Prettier конфигурация
- ✅ Jest тестирование (Unit + E2E)
- ✅ Swagger API документация
- ✅ Health checks
- ✅ Логирование и мониторинг

### 📊 База данных
- ✅ Полная схема Prisma
- ✅ Миграции и сиды
- ✅ Начальные данные (ритуалы, камни, рецепты)

## 🚀 Как запустить

### 1. Быстрый старт с Docker
```bash
# Клонировать репозиторий
git clone <repository-url>
cd MysticalAsttoServer

# Запустить все сервисы
docker-compose up -d

# Приложение будет доступно на http://localhost:3010
# Swagger документация: http://localhost:3010/api
```

### 2. Локальный запуск
```bash
# Установить зависимости
npm install

# Настроить .env файл
cp env.example .env

# Запустить PostgreSQL, Redis, RabbitMQ локально

# Выполнить миграции
npm run prisma:migrate

# Заполнить базу данных
npm run db:seed

# Запустить приложение
npm run start:dev
```

### 3. Использование Makefile
```bash
# Показать все команды
make help

# Полная настройка проекта
make setup

# Запуск в режиме разработки
make dev

# Запуск Docker сервисов
make docker-up

# Мониторинг системы
make monitor
```

## 🔮 Основные функции

### ✨ Энергетический движок
- Расчет daily energy score на основе лунных фаз, знака зодиака, элемента
- Учет времени года, дня недели и астрологических влияний
- Кэширование результатов в Redis

### 🌙 Астрологические расчеты
- Точные лунные фазы через Swiss Ephemeris
- Персональные влияния на основе натальной карты
- Рекомендации по активности и энергетике

### 🎯 Персональные рекомендации
- **Ритуал дня** - подбирается по энергии и лунной фазе
- **Камень дня** - выбирается по знаку зодиака и элементу
- **Рецепт настоя** - подбирается по астрологическому профилю
- **Энергетический совет** - на основе daily energy score
- **Астрологический путь** - план развития на текущий цикл

### 📅 Автоматизация
- **03:00** - Обновление астрологических данных
- **04:00** - Расчет energy score для всех пользователей
- **05:00** - Генерация персональных рекомендаций

## 🧪 Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Покрытие кода
npm run test:cov

# Линтинг
npm run lint

# Форматирование
npm run format
```

## 📚 API Endpoints

### 🔐 Аутентификация
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход
- `POST /auth/magic-link` - Magic Link
- `POST /auth/refresh` - Обновление токена

### 👥 Пользователи
- `GET /users/profile` - Профиль
- `PATCH /users/profile` - Обновление профиля

### 🌟 Астрология
- `GET /astro/moon/current` - Текущая лунная фаза
- `GET /astro/influences/today` - Влияния на сегодня

### ⚡ Энергетика
- `GET /energy/today` - Energy score на сегодня
- `GET /energy/history` - История показателей

### 🎯 Рекомендации
- `GET /recommendations/today` - Рекомендации на сегодня
- `GET /recommendations/feed/today` - Полный фид

## 🔧 Конфигурация

### Переменные окружения
```bash
# База данных
DATABASE_URL="postgresql://username:password@localhost:5432/mystical_astro"

# Redis
REDIS_URL="redis://localhost:6379"

# RabbitMQ
RABBITMQ_URL="amqp://localhost:5672"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## 🚀 Развертывание

### Docker
```bash
# Сборка и запуск
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f app

# Остановка
docker-compose down
```

### Продакшн
```bash
# Сборка
npm run build

# Запуск
npm run start:prod

# Или через PM2
pm2 start dist/main.js --name mystical-astro
```

## 🔮 Будущие улучшения

- [ ] ML-модели для рекомендаций
- [ ] Интеграция с ClickHouse для аналитики
- [ ] Микросервисная архитектура
- [ ] GraphQL API
- [ ] Мобильное приложение
- [ ] Интеграция с календарями
- [ ] Социальные функции
- [ ] WebSocket для real-time уведомлений
- [ ] Интеграция с внешними астрологическими API

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Commit изменения
4. Push в branch
5. Откройте Pull Request

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.

## 🆘 Поддержка

- 📖 Документация API: `/api`
- 🐛 Issues: GitHub Issues
- 💬 Обсуждения: GitHub Discussions

---

**🎉 Проект готов к использованию!**

**Создано с ❤️ для астрологического сообщества**

**Время создания: $(date)**
**Версия: 1.0.0** 