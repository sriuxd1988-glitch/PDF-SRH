import { Injectable, Logger } from '@nestjs/common';
import { prisma } from '@simplifypdf/database';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);

  constructor(private readonly redis: RedisService) {}

  // 1. Site Settings (Design Tokens & Branding)
  async getSiteSettings() {
    const cacheKey = 'cache:config:settings';
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'singleton' },
    });

    if (settings) {
      await this.redis.set(cacheKey, settings, 86400);
    }
    return settings;
  }

  async updateSiteSettings(data: any) {
    const updated = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: {
        ...data,
        liveSyncVersion: { increment: 1 },
      },
      create: {
        id: 'singleton',
        ...data,
      },
    });

    // Invalidate Redis cache and broadcast real-time sync
    await this.redis.del('cache:config:settings');
    await this.redis.publish('config:invalidated', JSON.stringify({ type: 'settings', version: updated.liveSyncVersion }));
    this.logger.log(`Site settings updated and cache purged (version ${updated.liveSyncVersion})`);
    return updated;
  }

  // 2. Header Config
  async getPublishedHeader() {
    const cacheKey = 'cache:config:header';
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const header = await prisma.headerConfig.findFirst({
      where: { isPublished: true },
    });

    if (header) {
      await this.redis.set(cacheKey, header, 86400);
    }
    return header;
  }

  async publishHeader(data: any) {
    const updated = await prisma.headerConfig.upsert({
      where: { id: 'singleton' },
      update: {
        ...data,
        isPublished: true,
        version: { increment: 1 },
      },
      create: {
        id: 'singleton',
        ...data,
        isPublished: true,
      },
    });

    await this.redis.del('cache:config:header');
    await this.redis.publish('config:invalidated', JSON.stringify({ type: 'header', version: updated.version }));
    return updated;
  }

  // 3. Footer Config
  async getPublishedFooter() {
    const cacheKey = 'cache:config:footer';
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const footer = await prisma.footerConfig.findFirst({
      where: { isPublished: true },
    });

    if (footer) {
      await this.redis.set(cacheKey, footer, 86400);
    }
    return footer;
  }

  async publishFooter(data: any) {
    const updated = await prisma.footerConfig.upsert({
      where: { id: 'singleton' },
      update: {
        ...data,
        isPublished: true,
        version: { increment: 1 },
      },
      create: {
        id: 'singleton',
        ...data,
        isPublished: true,
      },
    });

    await this.redis.del('cache:config:footer');
    await this.redis.publish('config:invalidated', JSON.stringify({ type: 'footer', version: updated.version }));
    return updated;
  }

  // 4. Page Blocks
  async getPublishedPage(slug: string) {
    const cacheKey = `cache:config:page:${slug}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const blocks = await prisma.pageBlock.findMany({
      where: { pageSlug: slug, isVisible: true },
      orderBy: { sortOrder: 'asc' },
    });

    await this.redis.set(cacheKey, blocks, 86400);
    return blocks;
  }

  async invalidatePage(slug: string) {
    await this.redis.del(`cache:config:page:${slug}`);
    await this.redis.publish('config:invalidated', JSON.stringify({ type: 'page', slug }));
  }

  // 5. Active Tools
  async getToolConfigs() {
    const cacheKey = 'cache:tools:active';
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const tools = await prisma.toolConfig.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    await this.redis.set(cacheKey, tools, 86400);
    return tools;
  }

  async updateToolConfig(slug: string, data: any) {
    const updated = await prisma.toolConfig.update({
      where: { slug },
      data,
    });

    await this.redis.del('cache:tools:active');
    await this.redis.publish('config:invalidated', JSON.stringify({ type: 'tools' }));
    return updated;
  }
}
