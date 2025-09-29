#!/bin/bash

echo "🔧 Установка зависимостей для Mystical Astro Server..."

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Пожалуйста, установите Node.js 18+"
    exit 1
fi

echo "✅ Node.js версии $(node -v) найден"

# Проверяем наличие npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен"
    exit 1
fi

echo "✅ npm найден"

# Очищаем кэш npm
echo "🧹 Очистка кэша npm..."
npm cache clean --force

# Удаляем node_modules и package-lock.json если они есть
if [ -d "node_modules" ]; then
    echo "🗑️ Удаление существующих node_modules..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo "🗑️ Удаление package-lock.json..."
    rm -f package-lock.json
fi

# Устанавливаем зависимости
echo "📦 Установка зависимостей..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Ошибка установки зависимостей"
    echo "Попробуйте выполнить: npm install --legacy-peer-deps"
    exit 1
fi

echo "✅ Зависимости установлены"

# Проверяем наличие @types/node
if [ ! -d "node_modules/@types/node" ]; then
    echo "⚠️ @types/node не найден, устанавливаем..."
    npm install --save-dev @types/node
fi

# Генерируем Prisma клиент
echo "🗄️ Генерация Prisma клиента..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Ошибка генерации Prisma клиента"
    exit 1
fi

echo "✅ Prisma клиент сгенерирован"

# Проверяем TypeScript
echo "🔍 Проверка TypeScript..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "⚠️ Обнаружены ошибки TypeScript"
    echo "Попробуйте исправить их вручную"
else
    echo "✅ TypeScript проверка пройдена"
fi

echo ""
echo "🎉 Установка завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Настройте .env файл"
echo "2. Запустите базу данных"
echo "3. Выполните миграции: npm run prisma:migrate"
echo "4. Запустите приложение: npm run start:dev"
echo ""
echo "🔧 Если проблемы с типами остались, попробуйте:"
echo "   npm install --save-dev @types/node@latest" 