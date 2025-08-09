import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth(): object {
    return {
      status: 'ok',
      message: 'trastor-play API server is running',
      timestamp: Date.now()
    };
  }
} 