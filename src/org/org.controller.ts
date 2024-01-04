import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrgService } from './org.service';
import { CreateOrgDto } from './dto/create-org.dto';

@Controller('org')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  @Post('add')
  add(@Body() dto: CreateOrgDto) {
    return this.orgService.create(dto);
  }

  @Get('list')
  list() {
    return this.orgService.orgList();
  }
}
