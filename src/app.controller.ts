import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './auth/jwt-auth.guard';


@ApiTags('Home')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Public()
  @Get()
  @ApiOperation({ summary: "Home", description: "No Description" })
  @ApiResponse({ status: 200 })
  home(): string {
    return this.appService.home();
  }
}
