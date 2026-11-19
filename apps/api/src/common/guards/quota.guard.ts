import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class QuotaGuard implements CanActivate {
  private readonly logger = new Logger(QuotaGuard.name);

  constructor(private readonly redis: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const headers = req.headers || {};

    const userId = headers['x-user-id'];
    const userRole = headers['x-user-role'] || 'GUEST';

    // Pro and Admin have high/unlimited quotas
    if (userRole === 'PRO' || userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      return true;
    }

    const todayDate = new Date().toISOString().split('T')[0];

    // 1. Authenticated Free User
    if (userId) {
      const redisKey = `user:quota:${userId}:${todayDate}`;
      const client = this.redis.getClient();
      const currentTasks = await client.incr(redisKey);

      if (currentTasks === 1) {
        // Expire at end of day (86400s)
        await client.expire(redisKey, 86400);
      }

      const freeDailyLimit = 10;
      if (currentTasks > freeDailyLimit) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            error: 'DAILY_QUOTA_EXCEEDED',
            message: `Free account limit of ${freeDailyLimit} daily tasks reached. Upgrade to Pro for 250 daily tasks and 2GB batch limits.`,
            quota: { used: currentTasks, limit: freeDailyLimit, resetsAt: 'Tomorrow 00:00 UTC' },
          },
          HttpStatus.TOO_MANY_REQUESTS
        );
      }
      return true;
    }

    // 2. Unauthenticated Guest
    const rawIp =
      headers['cf-connecting-ip'] ||
      headers['x-forwarded-for']?.split(',')[0] ||
      req.ip ||
      '127.0.0.1';

    const salt = process.env.QUOTA_SALT || 'simplifypdf_daily_guest_salt';
    const ipHash = createHash('sha256').update(`${rawIp}:${salt}:${todayDate}`).digest('hex');

    const guestKey = `guest:quota:${ipHash}:${todayDate}`;
    const client = this.redis.getClient();
    const guestTasks = await client.incr(guestKey);

    if (guestTasks === 1) {
      await client.expire(guestKey, 86400);
    }

    const guestDailyLimit = 3;
    if (guestTasks > guestDailyLimit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'GUEST_QUOTA_EXCEEDED',
          message: `Guest limit of ${guestDailyLimit} free tasks reached today. Sign up for a free account to get 10 tasks/day, or go Pro for unlimited workflows.`,
          quota: { used: guestTasks, limit: guestDailyLimit, resetsAt: 'Tomorrow 00:00 UTC' },
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }
}
