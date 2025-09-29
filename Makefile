.PHONY: help install build start dev test lint format clean docker-up docker-down migrate seed studio generate setup reset-db logs monitor deploy status fix-prisma fix-types fix-yarn

help: ## Показать справку по командам
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Установить зависимости
	npm install

build: ## Собрать приложение
	npm run build

start: ## Запустить приложение
	npm run start

dev: ## Запустить в режиме разработки
	npm run start:dev

test: ## Запустить тесты
	npm run test

lint: ## Проверить код линтером
	npm run lint

format: ## Отформатировать код
	npm run format

clean: ## Очистить собранные файлы
	rm -rf dist
	rm -rf node_modules
	rm -f package-lock.json

docker-up: ## Запустить Docker контейнеры
	docker-compose up -d

docker-down: ## Остановить Docker контейнеры
	docker-compose down

migrate: ## Выполнить миграции базы данных
	npx prisma migrate dev

seed: ## Заполнить базу тестовыми данными
	npm run db:seed

studio: ## Открыть Prisma Studio
	npx prisma studio

generate: ## Сгенерировать Prisma клиент
	npx prisma generate

setup: ## Первоначальная настройка проекта
	@echo "🔧 Настройка проекта..."
	@make install
	@make generate
	@echo "✅ Настройка завершена"

reset-db: ## Сбросить базу данных
	@echo "⚠️ Внимание! Это удалит все данные!"
	@read -p "Продолжить? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	npx prisma migrate reset --force

logs: ## Показать логи Docker контейнеров
	docker-compose logs -f

monitor: ## Мониторинг Docker контейнеров
	docker-compose ps
	docker stats --no-stream

deploy: ## Деплой приложения
	@echo "🚀 Деплой приложения..."
	@make build
	@make docker-up
	@echo "✅ Деплой завершен"

status: ## Показать статус всех сервисов
	@echo "📊 Статус сервисов:"
	@make monitor
	@echo ""
	@echo "🔍 Проверка здоровья:"
	curl -s http://localhost:3000/health || echo "❌ Приложение недоступно"

fix-prisma: ## Исправить проблемы с Prisma
	@echo "🔧 Исправление проблем с Prisma..."
	@chmod +x fix-prisma.sh
	./fix-prisma.sh

fix-types: ## Исправить проблемы с типами TypeScript
	@echo "🔧 Исправление проблем с типами..."
	@chmod +x install-deps.sh
	./install-deps.sh

fix-yarn: ## Исправить проблемы с yarn и переключиться на npm
	@echo "🔧 Исправление проблем с yarn..."
	@chmod +x fix-yarn-issues.sh
	./fix-yarn-issues.sh

fix-all: ## Исправить все проблемы (Prisma + типы + yarn)
	@echo "🔧 Комплексное исправление..."
	@make fix-yarn
	@make fix-prisma
	@make fix-types
	@echo "✅ Все проблемы исправлены" 