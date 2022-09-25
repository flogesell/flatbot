import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ExpenesesService } from './expeneses.service';
import { ApiVersion, AuthGuard } from '../../providers/guards';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/providers/guards/jwt-auth-guard';
import { UpdatePasswordDto } from 'src/validation/users.user.dto';
import { CreateExpenese } from 'src/validation/expenese.types';

@ApiTags('expense')
@ApiVersion('v1')
@Controller('expense')
export class ExpensesController {
  constructor(private readonly expenesesService: ExpenesesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getAllExpeneses(@Request() req) {
    return await this.expenesesService.getAllExpeneses(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getSpecific(@Request() req, @Param('id') expenseId) {
    return await this.expenesesService.getSpecific(req.user, expenseId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createExpense(
    @Request() req,
    @Body() createExpense: CreateExpenese,
  ) {
    return await this.expenesesService.createExpense(req.user, createExpense);
  }
}
