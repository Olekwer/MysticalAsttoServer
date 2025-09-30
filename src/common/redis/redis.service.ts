import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly isRedisAvailable: boolean;
  private readonly mockStorage = new Map<string, { value: string; ttl?: number }>();

  constructor(private configService: ConfigService) {
    // Проверяем доступность Redis
    this.isRedisAvailable = false; // Временно отключаем Redis

    if (this.isRedisAvailable) {
      console.log('✅ Redis connected');
    } else {
      console.log('⚠️ Redis not available, using mock storage');
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (this.isRedisAvailable) {
        // Здесь был бы реальный Redis код
        return null;
      } else {
        const item = this.mockStorage.get(key);
        if (item && (!item.ttl || Date.now() < item.ttl)) {
          return item.value;
        }
        return null;
      }
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (this.isRedisAvailable) {
        // Здесь был бы реальный Redis код
      } else {
        const ttlMs = ttl ? Date.now() + ttl * 1000 : undefined;
        this.mockStorage.set(key, { value, ttl: ttlMs });
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (this.isRedisAvailable) {
        // Здесь был бы реальный Redis код
      } else {
        this.mockStorage.delete(key);
      }
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (this.isRedisAvailable) {
        // Здесь был бы реальный Redis код
        return false;
      } else {
        return this.mockStorage.has(key);
      }
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  async incr(key: string): Promise<number> {
    try {
      if (this.isRedisAvailable) {
        // Здесь был бы реальный Redis код
        return 0;
      } else {
        const current = this.mockStorage.get(key);
        const newValue = (current ? parseInt(current.value) : 0) + 1;
        this.mockStorage.set(key, { value: newValue.toString() });
        return newValue;
      }
    } catch (error) {
      console.error('Redis incr error:', error);
      return 0;
    }
  }

  async expire(key: string, seconds: number): Promise<void> {
    try {
      if (this.isRedisAvailable) {
        // Здесь был бы реальный Redis код
      } else {
        const item = this.mockStorage.get(key);
        if (item) {
          item.ttl = Date.now() + seconds * 1000;
        }
      }
    } catch (error) {
      console.error('Redis expire error:', error);
    }
  }

  async onModuleDestroy() {
    if (this.isRedisAvailable) {
      // Здесь был бы реальный Redis код
    }
    console.log('❌ Redis disconnected');
  }
}
