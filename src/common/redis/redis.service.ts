import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redisClient: Redis.RedisClientType;

  constructor(private configService: ConfigService) {
    this.redisClient = Redis.createClient({
      url: this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379',
    });

    this.redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.redisClient.on('connect', () => {
      console.log('✅ Redis подключен');
    });

    this.redisClient.connect();
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redisClient.setEx(key, ttl, value);
      } else {
        await this.redisClient.set(key, value);
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  async incr(key: string): Promise<number> {
    try {
      return await this.redisClient.incr(key);
    } catch (error) {
      console.error('Redis incr error:', error);
      return 0;
    }
  }

  async expire(key: string, seconds: number): Promise<void> {
    try {
      await this.redisClient.expire(key, seconds);
    } catch (error) {
      console.error('Redis expire error:', error);
    }
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
    console.log('❌ Redis отключен');
  }
} 