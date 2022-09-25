import { Module } from '@nestjs/common';
import { GlobalProvidersModule } from './providers/global-providers.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './routes/auth/auth.module';
import { FlatModule } from './routes/flat/flat.module';
import { UserModule } from './routes/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExpenesesModule } from './routes/expenses/expenses.module';

const MODULES = [
  GlobalProvidersModule,
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env.dev',
  }),
  UserModule,
  AuthModule,
  FlatModule,
  ExpenesesModule,
];

const SERVICES = [AppService];

const CONTROLLERS = [AppController];

@Module({
  imports: [...MODULES],
  controllers: [...CONTROLLERS],
  providers: [...SERVICES],
})
export class AppModule {}
