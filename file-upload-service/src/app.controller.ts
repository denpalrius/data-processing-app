import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): { name: string; version: string; description: string } {
    return {
      name: 'data-processing-app',
      version: '1.0.0',
      description: 'This app processes data and handles file uploads.',
    };
  }
}
