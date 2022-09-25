import {
  Body,
  Controller,
  Get,
  Logger,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiVersion, AuthGuard } from '../../providers/guards';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/providers/guards/jwt-auth-guard';
import { UpdatePasswordDto } from 'src/validation/users.user.dto';

@ApiTags('user')
@ApiVersion('v1')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getProfile(@Request() req) {
    return await this.userService.getProfile(req.user);
  }

  @Put('update/password')
  @UseGuards(JwtAuthGuard)
  public async updatePassword(
    @Request() req,
    @Body()
    updatePasswordDto: UpdatePasswordDto,
  ) {
    await this.userService.updatePassword(updatePasswordDto, req.user.userid);
    return {
      message: 'password_update_success',
    };
  }
}
