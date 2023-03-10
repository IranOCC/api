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
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Public } from 'src/auth/jwt-auth.guard';

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

  @Post()
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingService.create(createSettingDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingService.update(+id, updateSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingService.remove(+id);
  }
}
