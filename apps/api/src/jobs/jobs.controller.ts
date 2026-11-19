import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Headers,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { JobsService, CreateJobDto } from './jobs.service';
import { QuotaGuard } from '../common/guards/quota.guard';
import { Observable } from 'rxjs';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(QuotaGuard)
  async createJob(
    @Body() dto: CreateJobDto,
    @Headers('x-user-id') userId?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    return this.jobsService.createJob({
      ...dto,
      userId: userId || dto.userId,
      userRole: userRole || dto.userRole || 'GUEST',
    });
  }

  @Get(':id')
  async getJob(@Param('id') id: string) {
    return this.jobsService.getJob(id);
  }

  @Sse(':id/progress')
  sseProgress(@Param('id') id: string): Observable<{ data: any }> {
    return this.jobsService.getProgressStream(id);
  }
}
