# Мультиязычность в Mystical Astro

Этот модуль обеспечивает поддержку мультиязычности для русского, английского и польского языков с автоматическим определением языка по IP пользователя.

## Поддерживаемые языки

- **en** - Английский (по умолчанию)
- **ru** - Русский
- **pl** - Польский

## Структура файлов

```
src/i18n/
├── en/
│   └── common.json          # Английские переводы
├── ru/
│   └── common.json          # Русские переводы
├── pl/
│   └── common.json          # Польские переводы
├── i18n.module.ts           # Модуль интернационализации
├── i18n.service.ts          # Сервис интернационализации
└── README.md                # Этот файл
```

## Автоматическое определение языка

Язык определяется автоматически по IP адресу пользователя:

- **Российские IP** → Русский язык
- **Польские IP** → Польский язык
- **Остальные IP** → Английский язык (по умолчанию)

## Использование в сервисах

### 1. Внедрение I18nService

```typescript
import { I18nService } from '../common/i18n/i18n.service';

@Injectable()
export class YourService {
  constructor(private i18nService: I18nService) {}

  async someMethod(req: Request) {
    // Автоматическое определение языка
    const language = this.i18nService.detectLanguage(req);
    
    // Перевод с автоматическим определением языка
    const message = await this.i18nService.translate(req, 'common.welcome');
    
    // Перевод на конкретный язык
    const ruMessage = await this.i18nService.translateToLanguage('ru', 'common.welcome');
  }
}
```

### 2. В контроллерах

```typescript
import { I18nService } from '../common/i18n/i18n.service';

@Controller('example')
export class ExampleController {
  constructor(private i18nService: I18nService) {}

  @Get()
  async getExample(@Req() req: any) {
    const language = this.i18nService.detectLanguage(req);
    const message = await this.i18nService.translate(req, 'common.hello');
    
    return {
      message,
      language,
      timestamp: new Date().toISOString(),
    };
  }
}
```

### 3. Использование декораторов

```typescript
import { I18n, CurrentLanguage, Translate } from '../common/decorators/i18n.decorator';

@Controller('example')
export class ExampleController {
  @Get()
  async getExample(
    @I18n() i18n: any,
    @CurrentLanguage() language: string,
    @Translate('common.welcome') welcomeMessage: string,
  ) {
    return {
      message: await i18n.translate('common.hello'),
      language,
      welcomeMessage,
    };
  }
}
```

## Добавление новых переводов

### 1. Добавьте ключ в английский файл (en/common.json)

```json
{
  "new_key": "New translation text"
}
```

### 2. Добавьте переводы в другие языки

**ru/common.json:**
```json
{
  "new_key": "Новый текст перевода"
}
```

**pl/common.json:**
```json
{
  "new_key": "Nowy tekst tłumaczenia"
}
```

### 3. Используйте в коде

```typescript
const message = await this.i18nService.translate(req, 'common.new_key');
```

## Настройка геолокации

В реальном проекте рекомендуется использовать специализированные сервисы геолокации:

- **MaxMind GeoIP2** - База данных IP адресов
- **IP-API** - Бесплатный API геолокации
- **ipapi.co** - Простой API геолокации

### Пример интеграции с IP-API

```typescript
private async getLanguageByIP(ip: string): Promise<string> {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      const countryCode = data.countryCode;
      
      switch (countryCode) {
        case 'RU':
          return 'ru';
        case 'PL':
          return 'pl';
        default:
          return 'en';
      }
    }
  } catch (error) {
    console.error('Ошибка геолокации:', error);
  }
  
  return 'en'; // По умолчанию
}
```

## Тестирование

### Проверка определения языка

```bash
# Локальный IP (английский)
curl http://localhost:3000/health

# Российский IP (русский)
curl -H "X-Forwarded-For: 2.56.0.1" http://localhost:3000/health

# Польский IP (польский)
curl -H "X-Forwarded-For: 5.0.0.1" http://localhost:3000/health
```

### Проверка переводов

```typescript
// В тестах
describe('I18nService', () => {
  it('should detect Russian language for Russian IP', () => {
    const mockReq = {
      headers: { 'x-forwarded-for': '2.56.0.1' },
      ip: '2.56.0.1',
    } as any;
    
    const language = i18nService.detectLanguage(mockReq);
    expect(language).toBe('ru');
  });
});
```

## Производительность

- Переводы загружаются при старте приложения
- Поддерживается hot-reload для файлов переводов
- Кэширование переводов в памяти
- Автоматическая генерация TypeScript типов

## Безопасность

- Валидация входных данных
- Санитизация HTML в email шаблонах
- Защита от XSS атак
- Логирование ошибок геолокации

## Мониторинг

- Логирование определенного языка для каждого запроса
- Метрики использования языков
- Алерты при ошибках геолокации
- Мониторинг производительности переводов
