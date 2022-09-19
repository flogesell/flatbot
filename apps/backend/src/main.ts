import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { GlobalConfigService } from './providers/services/config/config.service';
import { HttpExceptionFilter } from './providers/services/error/http-exception.filter';
import { json, urlencoded } from 'body-parser';

const logger = new Logger('main.ts');
const namespace = 'src/main.ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sizeLimit = '50mb';

  const globalConfigService: GlobalConfigService = app.get(GlobalConfigService);
  const port = globalConfigService.getPort();

  const whitelistOrigins = [];
  whitelistOrigins.push('http://localhost');
  whitelistOrigins.push('http://127.0.0.1');
  if (globalConfigService.getValue('ENV') !== 'DEV') {
    whitelistOrigins.push(globalConfigService.getValue('HOSTNAME'));
    const internalTargetName = `http://${globalConfigService.getValue(
      'APP_NAME',
    )}-service.${globalConfigService.getValue('NAMESPACE')}.svc.cluster.local`;
    whitelistOrigins.push(internalTargetName);
  }
  app.enableCors({
    origin: function (origin, callback) {
      if (origin) {
        const originArr = origin.split(':');
        let corsAllowed = false;
        for (let i = 0; i < whitelistOrigins.length; ++i) {
          if (
            (originArr[0] + ':' + originArr[1]).indexOf(whitelistOrigins[i]) !==
            -1
          ) {
            corsAllowed = true;
            break;
          }
        }
        if (corsAllowed) {
          callback(undefined, true);
        } else {
          logger.warn(origin + ' not allowed by CORS', namespace);
          callback(new Error('Not allowed by CORS'));
        }
      } else {
        callback(undefined, true);
      }
    },
    allowedHeaders: 'Authorization,Content-Type,Accept',
    credentials: true,
    preflightContinue: false,
    methods: 'GET,PATCH,PUT,POST,DELETE,OPTIONS',
    optionsSuccessStatus: 204,
  });

  const config = new DocumentBuilder()
    .setTitle('iQontrol Main Backend')
    .setDescription('iQontrol Main Backend API')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(json({ limit: sizeLimit }));
  app.use(urlencoded({ limit: sizeLimit, extended: true }));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api/:v');
  await app.listen(port);
  logger.log(`App started and listening on: 0.0.0.0:${port}/`, namespace);
}
bootstrap();
