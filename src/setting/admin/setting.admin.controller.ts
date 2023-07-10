import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SettingServiceAdmin } from './setting.admin.service';



@Controller('admin/setting')
@ApiTags('Setting')
@ApiBearerAuth()
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
