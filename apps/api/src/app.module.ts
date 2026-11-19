import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from './config/config.module';
import { StorageModule } from './storage/storage.module';
import { JobsModule } from './jobs/jobs.module';
import { HealthModule } from './health/health.module';
import { BillingModule } from './modules/billing/billing.module';

@Module({
  imports: [
    NestConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    ConfigModule,
    StorageModule,
    JobsModule,
    HealthModule,
    BillingModule,
  ],
})
export class AppModule {}
