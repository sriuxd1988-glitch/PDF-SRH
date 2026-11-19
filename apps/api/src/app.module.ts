import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from './config/config.module';
import { StorageModule } from './storage/storage.module';
import { JobsModule } from './jobs/jobs.module';
import { HealthModule } from './health/health.module';
import { BillingModule } from './modules/billing/billing.module';

@Module({
  imports: [
    NestConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60, // 60 requests per minute per IP
      },
    ]),
    RedisModule,
    ConfigModule,
    StorageModule,
    JobsModule,
    HealthModule,
    BillingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
