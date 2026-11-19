import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { QuotaGuard } from '../src/common/guards/quota.guard';
import { RedisService } from '../src/redis/redis.service';

describe('QuotaGuard Unit Tests', () => {
  let guard: QuotaGuard;
  let mockRedis: any;

  beforeEach(() => {
    mockRedis = {
      getClient: jest.fn().mockReturnValue({
        incr: jest.fn(),
        expire: jest.fn(),
      }),
    };
    guard = new QuotaGuard(mockRedis as unknown as RedisService);
  });

  const createMockContext = (headers: Record<string, string>, ip = '127.0.0.1'): ExecutionContext => {
    const req = {
      headers,
      ip,
    };
    return {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as unknown as ExecutionContext;
  };

  it('should allow PRO users regardless of task count', async () => {
    const context = createMockContext({ 'x-user-role': 'PRO' });
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(mockRedis.getClient().incr).not.toHaveBeenCalled();
  });

  it('should allow ADMIN users without quota checks', async () => {
    const context = createMockContext({ 'x-user-role': 'ADMIN' });
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should track and allow Free users within daily 10-task limit', async () => {
    mockRedis.getClient().incr.mockResolvedValue(4); // 4th task
    const context = createMockContext({ 'x-user-id': 'user_123', 'x-user-role': 'USER' });

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should reject Free users when daily limit of 10 tasks is exceeded', async () => {
    mockRedis.getClient().incr.mockResolvedValue(11); // 11th task
    const context = createMockContext({ 'x-user-id': 'user_123', 'x-user-role': 'USER' });

    await expect(guard.canActivate(context)).rejects.toThrow(HttpException);
  });

  it('should track and reject Guests when exceeding 3 tasks per day', async () => {
    mockRedis.getClient().incr.mockResolvedValue(4); // 4th task for guest
    const context = createMockContext({ 'cf-connecting-ip': '203.0.113.195' });

    await expect(guard.canActivate(context)).rejects.toThrow(HttpException);
  });
});
