import * as crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
(global as any).crypto = crypto;
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { setupDocumentation } from 'docs/documentation';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupDocumentation(app);
  await app.startAllMicroservices();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Habilitando CORS
  app.enableCors({
    origin:
      process.env.AMBIENTE === 'PROD'
        ? [
            process.env.FRONTEND_URL_PROD,
            process.env.FRONTEND_URL_PROFESSOR,
            process.env.FRONTEND_URL_MOBILE_PROD,
          ]
        : [process.env.FRONTEND_URL_LOCAL, process.env.FRONTEND_URL_MOBILE_LOCAL, 'http://localhost:8081'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('==========================');
  console.log('===== Tech Challenge =====');
  console.log(`=====   Vs.: 1.0.0   =====`);
  console.log(`=====   Port: 3000   =====`);
  console.log('==========================');
}
void bootstrap();
