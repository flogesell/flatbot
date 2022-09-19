import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GlobalProvidersModule } from '../../providers/global-providers.module';
import { PrismaService } from 'src/providers/services/prisma.service';

const MODULES = [GlobalProvidersModule];

const CONTROLLERS = [UserController];

const SERVICES = [UserService, PrismaService];

@Module({
  imports: [...MODULES],
  controllers: [...CONTROLLERS],
  providers: [...SERVICES],
})
export class UserModule {}
