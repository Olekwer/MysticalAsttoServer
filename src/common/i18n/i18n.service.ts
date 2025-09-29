import { Injectable } from '@nestjs/common';
import { I18nService as NestI18nService } from 'nestjs-i18n';
import { Request } from 'express';

export type SupportedLanguage = 'en' | 'ru' | 'pl';

@Injectable()
export class I18nService {
  constructor(private readonly i18n: NestI18nService) {}

  /**
   * Автоматически определяет язык пользователя по IP
   */
  detectLanguage(req: Request): SupportedLanguage {
    // Получаем IP из заголовков
    const ip = this.getClientIP(req);
    
    // Определяем язык по IP (геолокация)
    const language = this.getLanguageByIP(ip);
    
    // Проверяем, поддерживается ли язык
    if (this.isLanguageSupported(language)) {
      return language;
    }
    
    // Если язык не поддерживается, возвращаем английский по умолчанию
    return 'en';
  }

  /**
   * Получает IP клиента из различных заголовков
   */
  private getClientIP(req: Request): string {
    // Проверяем различные заголовки для получения реального IP
    const xForwardedFor = req.headers['x-forwarded-for'];
    const xRealIP = req.headers['x-real-ip'];
    const cfConnectingIP = req.headers['cf-connecting-ip'];
    
    if (cfConnectingIP) {
      return Array.isArray(cfConnectingIP) ? cfConnectingIP[0] : cfConnectingIP;
    }
    
    if (xRealIP) {
      return Array.isArray(xRealIP) ? xRealIP[0] : xRealIP;
    }
    
    if (xForwardedFor) {
      const ips = Array.isArray(xForwardedFor) ? xForwardedFor : xForwardedFor.split(',');
      return ips[0].trim();
    }
    
    return req.ip || req.connection.remoteAddress || '127.0.0.1';
  }

  /**
   * Определяет язык по IP адресу
   * В реальном проекте здесь можно использовать сервис геолокации
   */
  private getLanguageByIP(ip: string): string {
    // Простая логика определения языка по IP
    // В реальном проекте рекомендуется использовать сервис геолокации
    
    // Российские IP диапазоны
    if (this.isRussianIP(ip)) {
      return 'ru';
    }
    
    // Польские IP диапазоны
    if (this.isPolishIP(ip)) {
      return 'pl';
    }
    
    // По умолчанию английский
    return 'en';
  }

  /**
   * Проверяет, является ли IP российским
   */
  private isRussianIP(ip: string): boolean {
    // Простая проверка для демонстрации
    // В реальном проекте используйте базу данных IP или API геолокации
    // Простая проверка для демонстрации
    // В реальном проекте используйте библиотеку для проверки IP диапазонов
    return ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.');
  }

  /**
   * Проверяет, является ли IP польским
   */
  private isPolishIP(ip: string): boolean {
    // Простая проверка для демонстрации
    // В реальном проекте используйте базу данных IP или API геолокации
    // Простая проверка для демонстрации
    return ip.startsWith('5.') || ip.startsWith('31.') || ip.startsWith('37.');
  }

  /**
   * Проверяет, поддерживается ли язык
   */
  private isLanguageSupported(language: string): language is SupportedLanguage {
    return ['en', 'ru', 'pl'].includes(language);
  }

  /**
   * Получает перевод по ключу с автоматическим определением языка
   */
  async translate(req: Request, key: string, options?: any): Promise<string> {
    const language = this.detectLanguage(req);
    return this.i18n.translate(key, { lang: language, ...options });
  }

  /**
   * Получает перевод по ключу для конкретного языка
   */
  async translateToLanguage(language: SupportedLanguage, key: string, options?: any): Promise<string> {
    return this.i18n.translate(key, { lang: language, ...options });
  }

  /**
   * Получает текущий язык из запроса
   */
  getCurrentLanguage(req: Request): SupportedLanguage {
    return this.detectLanguage(req);
  }

  /**
   * Получает список поддерживаемых языков
   */
  getSupportedLanguages(): SupportedLanguage[] {
    return ['en', 'ru', 'pl'];
  }

  /**
   * Проверяет, является ли язык поддерживаемым
   */
  isSupportedLanguage(language: string): language is SupportedLanguage {
    return this.isLanguageSupported(language);
  }
}
