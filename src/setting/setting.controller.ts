import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import { Public } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {
    // #
  }

  @Get('webInitialData')
  @Public()
  getInitialData() {
    return this.settingService.getWebInitialData();
  }

  @Get('initial')
  @Roles(RoleEnum.SuperAdmin)
  getInitial() {
    return this.settingService.getInitial();
  }

  @Patch('initial')
  @Roles(RoleEnum.SuperAdmin)
  setInitial() {
    return this.settingService.setInitial();
  }


}
