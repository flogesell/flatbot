import { Module } from '@nestjs/common';
import { GlobalProvidersModule } from './providers/global-providers.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './routes/auth/auth.module';
import { UserModule } from './routes/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const MODULES = [
  GlobalProvidersModule,
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env.dev',
  }),
  UserModule,
  AuthModule,
];

const SERVICES = [AppService];

const CONTROLLERS = [AppController];

@Module({
  imports: [...MODULES],
  controllers: [...CONTROLLERS],
  providers: [...SERVICES],
})
export class AppModule {}
