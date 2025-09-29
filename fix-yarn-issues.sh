#!/bin/bash

echo "🔧 Исправление проблем с yarn и установка через npm..."

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен"
    exit 1
fi

echo "✅ Node.js версии $(node -v) найден"

# Проверяем наличие npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен"
    exit 1
fi

echo "✅ npm найден"

# Удаляем все lock файлы и node_modules
echo "🧹 Очистка проекта..."
if [ -d "node_modules" ]; then
    echo "🗑️ Удаление node_modules..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo "🗑️ Удаление package-lock.json..."
    rm -f package-lock.json
fi

if [ -f "yarn.lock" ]; then
    echo "🗑️ Удаление yarn.lock..."
    rm -f yarn.lock
fi

# Очищаем кэш npm
echo "🧹 Очистка кэша npm..."
npm cache clean --force

# Проверяем package.json на наличие проблемных пакетов
echo "🔍 Проверка package.json..."
if grep -q "@types/swisseph" package.json; then
    echo "⚠️ Найден проблемный пакет @types/swisseph, удаляем..."
    # Временно удаляем проблемную строку
    sed -i.bak '/@types\/swisseph/d' package.json
    echo "✅ Проблемный пакет удален"
fi

# Устанавливаем зависимости через npm
echo "📦 Установка зависимостей через npm..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Ошибка установки зависимостей"
    echo "Попробуйте: npm install --legacy-peer-deps"
    exit 1
fi

echo "✅ Зависимости установлены"

# Проверяем Prisma
echo "🗄️ Проверка Prisma..."
if ! npx prisma --version &> /dev/null; then
    echo "❌ Prisma не найден"
    exit 1
fi

echo "✅ Prisma найден"

# Генерируем Prisma клиент
echo "🔨 Генерация Prisma клиента..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Ошибка генерации Prisma клиента"
    echo "Проверьте prisma/schema.prisma"
    exit 1
fi

echo "✅ Prisma клиент сгенерирован"

# Проверяем TypeScript
echo "🔍 Проверка TypeScript..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "⚠️ Обнаружены ошибки TypeScript"
    echo "Проверьте файлы на наличие ошибок"
else
    echo "✅ TypeScript проверка пройдена"
fi

# Проверяем наличие сгенерированных типов
if [ -d "node_modules/.prisma/client" ]; then
    echo "✅ Prisma типы найдены"
else
    echo "❌ Prisma типы не найдены"
    exit 1
fi

# Восстанавливаем package.json если был изменен
if [ -f "package.json.bak" ]; then
    echo "🔄 Восстановление package.json..."
    mv package.json.bak package.json
fi

echo ""
echo "🎉 Исправление завершено!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Проверьте, что ошибки TypeScript исчезли"
echo "2. Запустите приложение: npm run start:dev"
echo "3. Если есть ошибки, проверьте импорты в файлах"
echo ""
echo "🔧 Если проблемы остались:"
echo "   - Проверьте prisma/schema.prisma"
echo "   - Убедитесь, что все модели правильно определены"
echo "   - Попробуйте: npx prisma db push"
echo ""
echo "⚠️ Важно: Используйте npm вместо yarn для этого проекта" 