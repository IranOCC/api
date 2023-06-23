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
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { SettingsKeys } from './enum/settingKeys.enum';
import { InitialSettingDto } from './dto/initialSetting.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Setting')
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

  // ==

  @Get(':key')
  @Roles(RoleEnum.SuperAdmin)
  get(@Param('key') key: SettingsKeys) {
    return this.settingService.get(key);
  }

  @Patch(':key')
  @Roles(RoleEnum.SuperAdmin)
  set(@Param('key') key: SettingsKeys, @Body() data: InitialSettingDto) {
    return this.settingService.set(key, data);
  }


}
