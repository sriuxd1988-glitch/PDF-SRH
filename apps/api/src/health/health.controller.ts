import { Controller, Get } from '@nestjs/common';
import { prisma } from '@simplifypdf/database';
import { RedisService } from '../redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(private readonly redis: RedisService) {}

  @Get()
  async check() {
    let dbStatus = 'ok';
    let redisStatus = 'ok';

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'error';
    }

    try {
      const ping = await this.redis.getClient().ping();
      if (ping !== 'PONG') redisStatus = 'error';
    } catch {
      redisStatus = 'error';
    }

    return {
      status: dbStatus === 'ok' && redisStatus === 'ok' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        redis: redisStatus,
      },
      uptime: process.uptime(),
    };
  }
}
