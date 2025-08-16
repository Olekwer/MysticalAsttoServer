# 🚀 Быстрое исправление проблем

## ❌ Ошибка: "Свойство 'notification' не существует в типе 'PrismaService'"

### 🔧 Быстрое решение (3 команды)

```bash
# 1. Очистка и переустановка
make clean

# 2. Установка зависимостей
make install

# 3. Генерация Prisma клиента
make generate
```

### 🐛 Если не работает, попробуйте:

```bash
# Альтернативный способ
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

## ❌ Ошибка: "Не удается найти имя 'process'"

### 🔧 Быстрое решение:

```bash
# Исправление типов
make fix-types

# Или вручную
npm install --save-dev @types/node@latest
```

## 🚨 Критические проблемы

### 1. Prisma клиент не генерируется
```bash
# Проверьте schema.prisma
cat prisma/schema.prisma

# Принудительная генерация
npx prisma generate --force
```

### 2. Зависимости не устанавливаются
```bash
# Очистка кэша
npm cache clean --force

# Установка с флагами
npm install --legacy-peer-deps
```

### 3. TypeScript ошибки
```bash
# Проверка конфигурации
npx tsc --noEmit

# Исправление всех проблем
make fix-all
```

## 📋 Проверочный список

После исправления проверьте:

- [ ] `npx prisma generate` выполняется без ошибок
- [ ] `npx tsc --noEmit` не показывает ошибок
- [ ] В `node_modules/.prisma/client` есть файлы
- [ ] Приложение запускается: `npm run start:dev`

## 🆘 Если ничего не помогает

```bash
# Полная переустановка
make clean
make install
make generate
make setup
```

## 📞 Команды для диагностики

```bash
# Статус всех сервисов
make status

# Проверка Docker
make monitor

# Логи приложения
make logs
``` 