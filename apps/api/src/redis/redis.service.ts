import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;
  private subscriber: Redis;

  onModuleInit() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => Math.min(times * 100, 3000),
    });
    this.subscriber = new Redis(redisUrl);

    this.client.on('connect', () => this.logger.log('Redis client connected'));
    this.client.on('error', (err) => this.logger.error('Redis error', err));
  }

  onModuleDestroy() {
    this.client?.disconnect();
    this.subscriber?.disconnect();
  }

  getClient(): Redis {
    return this.client;
  }

  getSubscriber(): Redis {
    return this.subscriber;
  }

  // Cache Operations
  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 86400): Promise<void> {
    const payload = typeof value === 'string' ? value : JSON.stringify(value);
    await this.client.set(key, payload, 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  // Pub/Sub Invalidation
  async publish(channel: string, message: string): Promise<number> {
    return this.client.publish(channel, message);
  }

  // Redis Streams
  async pushJobStream(streamName: string, payload: Record<string, string>): Promise<string> {
    const entries: string[] = [];
    for (const [key, val] of Object.entries(payload)) {
      entries.push(key, typeof val === 'string' ? val : JSON.stringify(val));
    }
    return this.client.xadd(streamName, '*', ...entries);
  }
}
