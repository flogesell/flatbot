import { Module } from '@nestjs/common';
import 'dotenv/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GlobalProvidersModule } from '../../providers/global-providers.module';
import { PrismaService } from 'src/providers/services/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

const MODULES = [
  GlobalProvidersModule,
  PassportModule.register({
    defaultStrategy: 'jwt',
    property: 'user',
    session: false,
  }),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('SECRET'),
      signOptions: {
        expiresIn: process.env.EXPIRESIN,
      },
    }),
    inject: [ConfigService],
  }),
];

const CONTROLLERS = [AuthController];

const SERVICES = [AuthService, PrismaService, JwtStrategy, UserService];

@Module({
  imports: [...MODULES],
  controllers: [...CONTROLLERS],
  providers: [...SERVICES],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
