import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { SettingsKeys } from '../enum/settingKeys.enum';
import { InitialSettingDto } from '../dto/initialSetting.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SettingService } from './setting.service';



@Controller('setting')
@Public()
@ApiTags('Setting')
@ApiBearerAuth()
export class SettingController {
  constructor(private readonly settingService: SettingService) {
    // #
  }


  @Get('webInfo')
  getInitialData() {
    return this.settingService.getWebInitialData();
  }




}
