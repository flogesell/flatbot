import { Module, Logger } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

import { APP_GUARD } from '@nestjs/core';
import { ApiVersionGuard } from './guards/api-versions/api-versions.guard';

import { GlobalConfigService } from './services/config/config.service';
import { ErrorService } from './services/error/error.service';
import { JwtService } from './services/jwt/jwt.service';

// AGENTS
import { QueueAgentService } from './agents/queue.agent';

const SERVICES = [
  Logger,
  GlobalConfigService,
  ErrorService,
  JwtService,

  // AGENTS
  //QueueAgentService,
];

const GUARDS = [
  {
    provide: APP_GUARD,
    useClass: ApiVersionGuard,
  },
];

const MODULES = [HttpModule, ScheduleModule.forRoot()];

@Module({
  imports: [...MODULES],
  providers: [...SERVICES, ...GUARDS],
  exports: [...SERVICES],
})
export class GlobalProvidersModule {}
