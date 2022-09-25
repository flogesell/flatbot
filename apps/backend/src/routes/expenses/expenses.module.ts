import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpenesesService } from './expeneses.service';
import { GlobalProvidersModule } from '../../providers/global-providers.module';
import { PrismaService } from 'src/providers/services/prisma.service';

const MODULES = [GlobalProvidersModule];

const CONTROLLERS = [ExpensesController];

const SERVICES = [ExpenesesService, PrismaService];

@Module({
  imports: [...MODULES],
  controllers: [...CONTROLLERS],
  providers: [...SERVICES],
})
export class ExpenesesModule {}
