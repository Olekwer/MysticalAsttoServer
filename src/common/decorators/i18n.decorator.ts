import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { I18nService } from '../i18n/i18n.service';

/**
 * Декоратор для автоматического перевода текста
 * Используется для получения перевода по ключу с автоматическим определением языка
 */
export const I18n = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const i18nService = request.app.get(I18nService);
    
    return {
      translate: (key: string, options?: any) => i18nService.translate(request, key, options),
      getCurrentLanguage: () => i18nService.getCurrentLanguage(request),
      getSupportedLanguages: () => i18nService.getSupportedLanguages(),
    };
  },
);

/**
 * Декоратор для получения текущего языка
 */
export const CurrentLanguage = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const i18nService = request.app.get(I18nService);
    
    return i18nService.getCurrentLanguage(request);
  },
);

/**
 * Декоратор для получения перевода по ключу
 */
export const Translate = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const i18nService = request.app.get(I18nService);
    
    return i18nService.translate(request, key);
  },
);
