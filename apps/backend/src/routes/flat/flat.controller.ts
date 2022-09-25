import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { FlatService } from './flat.service';
import { ApiVersion } from '../../providers/guards';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/providers/guards/jwt-auth-guard';
import { UpdateFlat } from 'src/validation/flat.types';

@ApiTags('flat')
@ApiVersion('v1')
@Controller('flat')
export class FlatController {
  constructor(private readonly flatService: FlatService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getFlat(@Request() req) {
    return await this.flatService.getFlat(req.user);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  public async updateFlat(
    @Request() req,
    @Body()
    updateFlat: UpdateFlat,
  ) {
    return await this.flatService.updateFlat(req.user, updateFlat);
  }
}
