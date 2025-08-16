#!/bin/bash

echo "🚀 Настройка проекта Mystical Astro Server..."

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Пожалуйста, установите Node.js 18+"
    exit 1
fi

# Проверяем версию Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Требуется Node.js версии 18+. Текущая версия: $(node -v)"
    exit 1
fi

echo "✅ Node.js версии $(node -v) найден"

# Проверяем наличие npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен"
    exit 1
fi

echo "✅ npm найден"

# Устанавливаем зависимости
echo "📦 Установка зависимостей..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Ошибка установки зависимостей"
    exit 1
fi

echo "✅ Зависимости установлены"

# Создаем .env файл если его нет
if [ ! -f .env ]; then
    echo "🔧 Создание .env файла..."
    cp env.example .env
    echo "⚠️  Пожалуйста, отредактируйте .env файл с вашими настройками"
else
    echo "✅ .env файл уже существует"
fi

# Генерируем Prisma клиент
echo "🗄️  Генерация Prisma клиента..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Ошибка генерации Prisma клиента"
    exit 1
fi

echo "✅ Prisma клиент сгенерирован"

# Проверяем наличие Docker
if command -v docker &> /dev/null; then
    echo "🐳 Docker найден"
    echo "💡 Для запуска всех сервисов используйте: docker-compose up -d"
else
    echo "⚠️  Docker не найден. Для локального запуска потребуется:"
    echo "   - PostgreSQL 15+"
    echo "   - Redis 6+"
    echo "   - RabbitMQ 3+"
fi

echo ""
echo "🎉 Настройка завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Отредактируйте .env файл с вашими настройками"
echo "2. Запустите базу данных (PostgreSQL + Redis + RabbitMQ)"
echo "3. Выполните миграции: npm run prisma:migrate"
echo "4. Заполните базу данных: npm run db:seed"
echo "5. Запустите приложение: npm run start:dev"
echo ""
echo "📚 Документация API будет доступна по адресу: http://localhost:3000/api" 