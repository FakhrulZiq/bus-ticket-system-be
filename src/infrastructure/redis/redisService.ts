import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { IRedisService } from './redisInterface';

@Injectable()
export class RedisCacheService implements IRedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async set(key: string, value: any, ttl: number) {
    await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async get<T = any>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  keys(pattern: string): Promise<string[]> {
    return this.redisClient.keys(pattern);
  }

  async deleteMany(keys: string[]): Promise<void> {
    if (keys.length > 0) {
      await this.redisClient.del(...keys);
    }
  }
}
