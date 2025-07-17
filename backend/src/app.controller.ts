import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';

@Controller()
export class AppController {
  @Get('health')
  @HealthCheck()
  healthCheck() {
    return { status: 'UP', timestamp: new Date() };
  }
}
