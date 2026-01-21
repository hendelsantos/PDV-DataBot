import { Controller, Get, Patch, Body, Param, UseGuards, Request, Post } from '@nestjs/common';
import { BotInstancesService } from './bot-instances.service';
import { UpdateBotInstanceDto, UpdateBotConfigDto } from './dto/bot-instance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bot-instances')
@UseGuards(JwtAuthGuard)
export class BotInstancesController {
  constructor(private readonly botInstancesService: BotInstancesService) {}

  @Get()
  findByUser(@Request() req: any) {
    return this.botInstancesService.findByUser(req.user.id);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    const instance = await this.botInstancesService.findByUser(req.user.id);
    return this.botInstancesService.getStats(req.user.id, instance.id);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.botInstancesService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateBotInstanceDto,
  ) {
    return this.botInstancesService.update(req.user.id, id, updateDto);
  }

  @Patch(':id/config')
  updateConfig(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateBotConfigDto,
  ) {
    return this.botInstancesService.updateConfig(req.user.id, id, updateDto);
  }

  @Post(':id/activate')
  activate(@Request() req: any, @Param('id') id: string) {
    return this.botInstancesService.activate(req.user.id, id);
  }

  @Post(':id/deactivate')
  deactivate(@Request() req: any, @Param('id') id: string) {
    return this.botInstancesService.deactivate(req.user.id, id);
  }
}
