import { Module } from '@nestjs/common';
import { FlatController } from './flat.controller';
import { FlatService } from './flat.service';
import { GlobalProvidersModule } from '../../providers/global-providers.module';
import { PrismaService } from 'src/providers/services/prisma.service';

const MODULES = [GlobalProvidersModule];

const CONTROLLERS = [FlatController];

const SERVICES = [FlatService, PrismaService];

@Module({
  imports: [...MODULES],
  controllers: [...CONTROLLERS],
  providers: [...SERVICES],
})
export class FlatModule {}
