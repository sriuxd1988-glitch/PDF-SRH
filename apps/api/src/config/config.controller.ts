import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('settings')
  async getSettings() {
    return this.configService.getSiteSettings();
  }

  @Put('settings')
  async updateSettings(@Body() body: any) {
    return this.configService.updateSiteSettings(body);
  }

  @Get('header')
  async getHeader() {
    return this.configService.getPublishedHeader();
  }

  @Post('header/publish')
  async publishHeader(@Body() body: any): Promise<any> {
    return this.configService.publishHeader(body);
  }

  @Get('footer')
  async getFooter() {
    return this.configService.getPublishedFooter();
  }

  @Post('footer/publish')
  async publishFooter(@Body() body: any): Promise<any> {
    return this.configService.publishFooter(body);
  }

  @Get('page/:slug')
  async getPage(@Param('slug') slug: string) {
    return this.configService.getPublishedPage(slug);
  }

  @Get('tools')
  async getTools() {
    return this.configService.getToolConfigs();
  }

  @Put('tools/:slug')
  async updateTool(@Param('slug') slug: string, @Body() body: any): Promise<any> {
    return this.configService.updateToolConfig(slug, body);
  }
}
