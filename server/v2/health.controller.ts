import { Controller, Get } from '@nestjs/common';

@Controller('api/v2/health')
export class V2HealthController {
  @Get()
  health() {
    return { success: true, requestId: 'health', data: { status: 'ok', version: '2' } };
  }
}
