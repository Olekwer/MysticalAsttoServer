# 🔧 Решение проблем с Mystical Astro Server

## ❌ Ошибка: "Не удается найти имя 'process'"

### Причина
TypeScript не может найти типы для Node.js, что приводит к ошибкам с глобальными объектами как `process`, `Buffer`, `require` и т.д.

### Решение

#### 1. Установка зависимостей
```bash
# Очистка и переустановка
rm -rf node_modules package-lock.json
npm install

# Или с флагом для совместимости
npm install --legacy-peer-deps
```

#### 2. Проверка @types/node
```bash
# Убедитесь, что @types/node установлен
npm list @types/node

# Если не установлен, установите
npm install --save-dev @types/node@latest
```

#### 3. Использование скрипта установки
```bash
# Сделайте скрипт исполняемым
chmod +x install-deps.sh

# Запустите скрипт
./install-deps.sh
```

#### 4. Альтернативное решение через Makefile
```bash
# Очистка и переустановка
make clean
make install
make generate
```

## 🔍 Проверка конфигурации

### 1. Проверьте tsconfig.json
Убедитесь, что файл содержит правильные настройки:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "types": ["node"],
    "skipLibCheck": true
  }
}
```

### 2. Проверьте package.json
Убедитесь, что в devDependencies есть:
```json
{
  "devDependencies": {
    "@types/node": "^20.3.1",
    "typescript": "^5.1.3"
  }
}
```

## 🚀 Быстрое решение

### Шаг 1: Очистка
```bash
rm -rf node_modules package-lock.json
```

### Шаг 2: Установка
```bash
npm install
```

### Шаг 3: Генерация Prisma
```bash
npx prisma generate
```

### Шаг 4: Проверка TypeScript
```bash
npx tsc --noEmit
```

## 🐳 Решение через Docker

Если проблемы с локальной установкой, используйте Docker:

```bash
# Запуск всех сервисов
docker-compose up -d

# Проверка статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f app
```

## 🔧 Дополнительные решения

### 1. Обновление TypeScript
```bash
npm install --save-dev typescript@latest
```

### 2. Очистка кэша
```bash
npm cache clean --force
```

### 3. Проверка версий
```bash
node --version
npm --version
npx tsc --version
```

### 4. Переустановка глобальных пакетов
```bash
npm uninstall -g @nestjs/cli
npm install -g @nestjs/cli@latest
```

## 📋 Проверочный список

- [ ] Node.js 18+ установлен
- [ ] npm установлен
- [ ] @types/node в devDependencies
- [ ] TypeScript 5+ установлен
- [ ] Prisma клиент сгенерирован
- [ ] Нет ошибок TypeScript компиляции

## 🆘 Если ничего не помогает

1. **Создайте новый проект NestJS:**
   ```bash
   npx @nestjs/cli new test-project
   cd test-project
   npm install
   ```

2. **Сравните конфигурации** с рабочим проектом

3. **Проверьте версии** всех зависимостей

4. **Обратитесь к документации** NestJS и TypeScript

## 📞 Поддержка

- 📖 [NestJS Documentation](https://docs.nestjs.com/)
- 📖 [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- 🐛 [GitHub Issues](https://github.com/nestjs/nest/issues)
- 💬 [NestJS Discord](https://discord.gg/nestjs) 