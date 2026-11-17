import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const port = Number(this.configService.get<number>('REDIS_PORT')) || 6379;
    const password = this.configService.get<string>('REDIS_PASSWORD') || undefined;

    this.client = new Redis({
      host,
      port,
      password,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });

    this.client
      .connect()
      .then(() => this.logger.log(`Redis connected successfully to ${host}:${port}`))
      .catch((err) => this.logger.error(`Redis connection failed: ${err.message}`));
  }

  async onModuleDestroy() {
    await this.client?.quit();
  }

  getClient(): Redis {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK' | null> {
    if (ttlSeconds) {
      return this.client.set(key, value, 'EX', ttlSeconds);
    }
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  /**
   * Atomic Distributed Lock using SET NX EX
   * Returns true if lock acquired, false if already locked
   */
  async acquireLock(key: string, lockOwner: string, ttlSeconds: number): Promise<boolean> {
    const result = await this.client.set(key, lockOwner, 'EX', ttlSeconds, 'NX');
    return result === 'OK';
  }

  /**
   * Release lock safely only if the lockOwner matches
   */
  async releaseLock(key: string, lockOwner: string): Promise<boolean> {
    const luaScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    const result = await this.client.eval(luaScript, 1, key, lockOwner);
    return result === 1;
  }
}
