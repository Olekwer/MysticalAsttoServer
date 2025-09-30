import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from '../common/i18n/i18n.service';

// Mock nestjs-i18n
const mockTranslate = jest.fn();
const mockNestI18nService = {
  translate: mockTranslate,
};

jest.mock('nestjs-i18n', () => ({
  I18nService: jest.fn().mockImplementation(() => mockNestI18nService),
}));

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        I18nService,
        {
          provide: 'I18nService',
          useValue: mockNestI18nService,
        },
      ],
    }).compile();

    service = module.get<I18nService>(I18nService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('detectLanguage', () => {
    it('should detect Russian language for Russian IP', () => {
      const mockReq = {
        headers: { 'x-forwarded-for': '2.56.0.1' },
        ip: '2.56.0.1',
        connection: { remoteAddress: '2.56.0.1' },
      } as any;

      const language = service.detectLanguage(mockReq);
      expect(language).toBe('ru');
    });

    it('should detect Polish language for Polish IP', () => {
      const mockReq = {
        headers: { 'x-forwarded-for': '5.0.0.1' },
        ip: '5.0.0.1',
        connection: { remoteAddress: '5.0.0.1' },
      } as any;

      const language = service.detectLanguage(mockReq);
      expect(language).toBe('pl');
    });

    it('should default to English for other IPs', () => {
      const mockReq = {
        headers: { 'x-forwarded-for': '8.8.8.8' },
        ip: '8.8.8.8',
        connection: { remoteAddress: '8.8.8.8' },
      } as any;

      const language = service.detectLanguage(mockReq);
      expect(language).toBe('en');
    });

    it('should handle Cloudflare IP header', () => {
      const mockReq = {
        headers: { 'cf-connecting-ip': '2.56.0.1' },
        ip: '8.8.8.8',
        connection: { remoteAddress: '8.8.8.8' },
      } as any;

      const language = service.detectLanguage(mockReq);
      expect(language).toBe('ru');
    });

    it('should handle X-Real-IP header', () => {
      const mockReq = {
        headers: { 'x-real-ip': '5.0.0.1' },
        ip: '8.8.8.8',
        connection: { remoteAddress: '8.8.8.8' },
      } as any;

      const language = service.detectLanguage(mockReq);
      expect(language).toBe('pl');
    });

    it('should handle X-Forwarded-For header with multiple IPs', () => {
      const mockReq = {
        headers: { 'x-forwarded-for': '8.8.8.8, 2.56.0.1, 192.168.1.1' },
        ip: '8.8.8.8',
        connection: { remoteAddress: '8.8.8.8' },
      } as any;

      const language = service.detectLanguage(mockReq);
      expect(language).toBe('ru');
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return supported languages', () => {
      const languages = service.getSupportedLanguages();
      expect(languages).toEqual(['en', 'ru', 'pl']);
    });
  });

  describe('isSupportedLanguage', () => {
    it('should return true for supported languages', () => {
      expect(service.isSupportedLanguage('en')).toBe(true);
      expect(service.isSupportedLanguage('ru')).toBe(true);
      expect(service.isSupportedLanguage('pl')).toBe(true);
    });

    it('should return false for unsupported languages', () => {
      expect(service.isSupportedLanguage('de')).toBe(false);
      expect(service.isSupportedLanguage('fr')).toBe(false);
      expect(service.isSupportedLanguage('es')).toBe(false);
    });
  });

  describe('translate', () => {
    it('should translate with detected language', async () => {
      const mockReq = {
        headers: { 'x-forwarded-for': '2.56.0.1' },
        ip: '2.56.0.1',
        connection: { remoteAddress: '2.56.0.1' },
      } as any;

      mockTranslate.mockResolvedValue('Добро пожаловать');

      const result = await service.translate(mockReq, 'common.welcome');

      expect(mockTranslate).toHaveBeenCalledWith('common.welcome', { lang: 'ru' });
      expect(result).toBe('Добро пожаловать');
    });
  });

  describe('translateToLanguage', () => {
    it('should translate to specific language', async () => {
      mockTranslate.mockResolvedValue('Witamy');

      const result = await service.translateToLanguage('pl', 'common.welcome');

      expect(mockTranslate).toHaveBeenCalledWith('common.welcome', { lang: 'pl' });
      expect(result).toBe('Witamy');
    });
  });
});
