import { Injectable } from '@nestjs/common';
import { I18nResolver } from 'nestjs-i18n';
import { Request } from 'express';

@Injectable()
export class I18nResolverService implements I18nResolver {
  resolve(context: any): string | undefined {
    const request = context.switchToHttp().getRequest();
    if (!request) return 'en';
    
    // Получаем язык из заголовка Accept-Language
    const acceptLanguage = request.headers['accept-language'];
    if (acceptLanguage) {
      // Простая логика извлечения языка
      const language = acceptLanguage.split(',')[0].split('-')[0];
      if (['en', 'ru', 'pl'].includes(language)) {
        return language;
      }
    }
    
    return 'en';
  }
}
