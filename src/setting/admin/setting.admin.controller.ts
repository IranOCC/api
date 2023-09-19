import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SettingServiceAdmin } from './setting.admin.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { SettingsKeys } from '../enum/settingKeys.enum';
import { InitialSettingDto } from '../dto/initialSetting.dto';



@Controller('admin/setting')
@ApiTags('Setting')
@ApiBearerAuth()
export class SettingControllerAdmin {
  constructor(private readonly settingServiceAdmin: SettingServiceAdmin) {
    // #
  }

  @Get('initial')
  @Roles(RoleEnum.SuperAdmin)
  getInitial() {
    return this.settingServiceAdmin.getInitial();
  }

  @Patch('initial')
  @Roles(RoleEnum.SuperAdmin)
  setInitial(@Body() data: InitialSettingDto) {
    return this.settingServiceAdmin.setInitial(data);
  }


}
