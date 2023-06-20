import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Public()
  @Get()
  home(): string {
    return this.appService.home();
  }
}
