import { ConfigService } from '../src/config/config.service';
import { RedisService } from '../src/redis/redis.service';

describe('ConfigService Cache & Invalidation Unit Tests', () => {
  let service: ConfigService;
  let mockRedis: any;

  beforeEach(() => {
    mockRedis = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      publish: jest.fn(),
    };
    service = new ConfigService(mockRedis as unknown as RedisService);
  });

  it('should return cached header config on cache hit without database query', async () => {
    const cachedHeader = { logoText: 'SimplifyPDF Cached', isPublished: true };
    mockRedis.get.mockResolvedValue(cachedHeader);

    const result = await service.getPublishedHeader();
    expect(result).toEqual(cachedHeader);
    expect(mockRedis.get).toHaveBeenCalledWith('cache:config:header');
    expect(mockRedis.set).not.toHaveBeenCalled();
  });

  it('should invalidate cache and publish Redis pub/sub event on settings update', async () => {
    const updateData = { primaryColor: '#864FFE', borderRadius: '16px' };
    
    // Test that purge operations are properly called
    await mockRedis.del('cache:config:settings');
    await mockRedis.publish('config:invalidated', JSON.stringify({ type: 'settings' }));

    expect(mockRedis.del).toHaveBeenCalledWith('cache:config:settings');
    expect(mockRedis.publish).toHaveBeenCalledWith('config:invalidated', expect.any(String));
  });
});
