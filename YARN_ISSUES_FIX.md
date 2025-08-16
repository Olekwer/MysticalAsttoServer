# 🚨 Решение проблем с Yarn

## ❌ Ошибка: "@types/swisseph: Not found"

### 🔍 Причина проблемы
1. **Пакет не существует**: `@types/swisseph` не существует в npm registry
2. **Конфликт пакет-менеджеров**: Yarn пытается установить несуществующий пакет
3. **Поврежденные lock файлы**: yarn.lock содержит неверные зависимости

### 🚀 Быстрое решение

#### Вариант 1: Через Makefile
```bash
# Исправление всех проблем с yarn
make fix-yarn

# Или комплексное исправление
make fix-all
```

#### Вариант 2: Через скрипт
```bash
# Сделайте скрипт исполняемым
chmod +x fix-yarn-issues.sh

# Запустите исправление
./fix-yarn-issues.sh
```

#### Вариант 3: Вручную
```bash
# 1. Удалите все lock файлы и node_modules
rm -rf node_modules yarn.lock package-lock.json

# 2. Очистите кэш
npm cache clean --force

# 3. Установите через npm
npm install

# 4. Сгенерируйте Prisma клиент
npx prisma generate
```

## 🔧 Что делает скрипт fix-yarn-issues.sh

1. **Проверяет окружение**: Node.js и npm
2. **Очищает проект**: удаляет node_modules и lock файлы
3. **Исправляет package.json**: убирает проблемные пакеты
4. **Устанавливает зависимости**: через npm вместо yarn
5. **Генерирует Prisma**: создает типизированный клиент
6. **Проверяет TypeScript**: валидирует все типы

## ⚠️ Важные моменты

### 1. Используйте npm вместо yarn
```bash
# ❌ Не используйте yarn
yarn install

# ✅ Используйте npm
npm install
```

### 2. Проверьте package.json
Убедитесь, что в devDependencies НЕТ:
```json
{
  "devDependencies": {
    "@types/swisseph": "^0.5.1"  // ❌ Удалите эту строку
  }
}
```

### 3. Очистите кэш yarn
```bash
yarn cache clean
```

## 📋 Проверочный список после исправления

- [ ] `yarn.lock` удален
- [ ] `package-lock.json` создан
- [ ] `node_modules` установлен через npm
- [ ] `npx prisma generate` выполняется без ошибок
- [ ] `npx tsc --noEmit` не показывает ошибок
- [ ] Приложение запускается: `npm run start:dev`

## 🆘 Если проблемы остались

### 1. Проверьте версии
```bash
node --version    # Должно быть 18+
npm --version     # Должно быть 8+
npx prisma --version
```

### 2. Принудительная очистка
```bash
# Удалите все и переустановите
rm -rf node_modules package-lock.json yarn.lock
npm cache clean --force
npm install --force
```

### 3. Проверьте schema.prisma
```bash
# Убедитесь, что файл корректен
cat prisma/schema.prisma
```

## 🎯 Рекомендации

1. **Всегда используйте npm** для этого проекта
2. **Не смешивайте** yarn и npm
3. **Регулярно обновляйте** зависимости
4. **Проверяйте** package.json на наличие несуществующих пакетов

## 📞 Команды для диагностики

```bash
# Статус проекта
make status

# Проверка Docker
make monitor

# Логи приложения
make logs

# Справка по командам
make help
``` 