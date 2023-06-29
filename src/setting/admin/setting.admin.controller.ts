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
import { ApiTags } from '@nestjs/swagger';
import { SettingServiceAdmin } from './setting.admin.service';



@Controller('admin/setting')
@ApiTags('Setting')
export class SettingControllerAdmin {
  constructor(private readonly settingServiceAdmin: SettingServiceAdmin) {
    // #
  }

  // @Get(':key')
  // @Roles(RoleEnum.SuperAdmin)
  // get(@Param('key') key: SettingsKeys) {
  //   return this.settingServiceAdmin.get(key);
  // }

  // @Patch(':key')
  // @Roles(RoleEnum.SuperAdmin)
  // set(@Param('key') key: SettingsKeys, @Body() data: InitialSettingDto) {
  //   return this.settingServiceAdmin.set(key, data);
  // }


}
