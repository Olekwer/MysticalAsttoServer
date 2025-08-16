@echo off
echo 🔧 Исправление проблем с Prisma и TypeScript...

echo ✅ Node.js версии
node --version

echo 🧹 Очистка кэша...
npm cache clean --force

echo 🗑️ Удаление node_modules...
if exist node_modules rmdir /s /q node_modules

echo 🗑️ Удаление package-lock.json...
if exist package-lock.json del package-lock.json

echo 🗑️ Удаление yarn.lock...
if exist yarn.lock del yarn.lock

echo 📦 Установка зависимостей...
npm install

if %errorlevel% neq 0 (
    echo ❌ Ошибка установки зависимостей
    echo Попробуйте: npm install --legacy-peer-deps
    pause
    exit /b 1
)

echo ✅ Зависимости установлены

echo 🗄️ Проверка Prisma...
npx prisma --version

if %errorlevel% neq 0 (
    echo ❌ Prisma не найден
    pause
    exit /b 1
)

echo ✅ Prisma найден

echo 🔨 Генерация Prisma клиента...
npx prisma generate

if %errorlevel% neq 0 (
    echo ❌ Ошибка генерации Prisma клиента
    echo Проверьте prisma/schema.prisma
    pause
    exit /b 1
)

echo ✅ Prisma клиент сгенерирован

echo 🔍 Проверка TypeScript...
npx tsc --noEmit

if %errorlevel% neq 0 (
    echo ⚠️ Обнаружены ошибки TypeScript
    echo Проверьте файлы на наличие ошибок
) else (
    echo ✅ TypeScript проверка пройдена
)

echo.
echo 🎉 Исправление завершено!
echo.
echo 📋 Следующие шаги:
echo 1. Проверьте, что ошибки TypeScript исчезли
echo 2. Запустите приложение: npm run start:dev
echo 3. Если есть ошибки, проверьте импорты в файлах
echo.
echo 🔧 Если проблемы остались:
echo    - Проверьте prisma/schema.prisma
echo    - Убедитесь, что все модели правильно определены
echo    - Попробуйте: npx prisma db push
pause 