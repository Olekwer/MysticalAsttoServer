# 🔧 Seed Troubleshooting Guide


### Причина:
Команда `npm run db:seed` пытается подключиться к реальной базе данных PostgreSQL, которая не запущена.

### Решение 1: Использовать mock seed (рекомендуется для разработки)
```bash
npm run db:seed:mock
```

**Преимущества:**
- ✅ Работает без установки PostgreSQL
- ✅ Быстро создает тестовые данные
- ✅ Идеально для разработки и тестирования

### Решение 2: Настроить реальную базу данных

#### Шаг 1: Установить PostgreSQL
```bash
# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Шаг 2: Создать базу данных
```bash
# Войти в PostgreSQL
sudo -u postgres psql

# Создать базу данных
CREATE DATABASE mystical_astro;
CREATE USER mystical_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mystical_astro TO mystical_user;
\q
```

#### Шаг 3: Настроить переменные окружения
```bash
# В файле .env
DATABASE_URL="postgresql://mystical_user:your_password@localhost:5432/mystical_astro"
```

#### Шаг 4: Применить миграции
```bash
npm run prisma:migrate
npm run prisma:generate
```

#### Шаг 5: Запустить seed
```bash
npm run db:seed
```

## 🔍 Проверка статуса базы данных

### Проверка подключения PostgreSQL
```bash
# Проверить статус сервиса
brew services list | grep postgresql

# Проверить подключение
psql -h localhost -U postgres -d mystical_astro
```

### Проверка переменных окружения
```bash
# Проверить .env файл
cat .env | grep DATABASE_URL

# Проверить в приложении
curl http://localhost:3010/health
```

## 📊 Сравнение seed команд

| Команда | Требования | Результат | Использование |
|---------|------------|-----------|---------------|
| `npm run db:seed` | PostgreSQL + миграции | Реальные данные в БД | Продакшн, тестирование |
| `npm run db:seed:mock` | Только Node.js | Mock данные в памяти | Разработка, демо |

## 🚀 Быстрый старт без базы данных

### Для разработки:
```bash
# 1. Установить зависимости
npm install

# 2. Запустить mock seed
npm run db:seed:mock

# 3. Запустить приложение
npm run start:dev

# 4. Открыть Swagger
open http://localhost:3010/api
```

### Результат:
- ✅ Приложение запущено на порту 3010
- ✅ Mock данные загружены
- ✅ Все API endpoints доступны
- ✅ Swagger документация работает

## 🆘 Частые проблемы

### Проблема: "PrismaClientInitializationError"
**Решение:** Используйте `npm run db:seed:mock` вместо `npm run db:seed`

### Проблема: "Connection refused"
**Решение:** PostgreSQL не запущен. Запустите сервис или используйте mock seed.

### Проблема: "Database does not exist"
**Решение:** Создайте базу данных или используйте mock seed.

### Проблема: "Permission denied"
**Решение:** Проверьте права доступа пользователя к базе данных.

## 💡 Рекомендации

### Для разработки:
- Используйте `npm run db:seed:mock`
- Не устанавливайте PostgreSQL
- Работайте с mock данными

### Для продакшна:
- Установите PostgreSQL
- Настройте миграции
- Используйте `npm run db:seed`

### Для тестирования:
- Используйте mock seed для unit тестов
- Используйте реальную БД для e2e тестов

---

**Mock seed - идеальное решение для быстрого старта разработки! 🚀**
