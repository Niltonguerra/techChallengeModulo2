// (globalThis as { crypto: Crypto }).crypto = webcrypto as Crypto;
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { setupDocumentation } from 'docs/documentation';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  setupDocumentation(app);
  await app.startAllMicroservices();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Habilitando CORS
  app.enableCors({
    origin:
      process.env.AMBIENTE === 'PROD'
        ? process.env.FRONTEND_URL_PROD
        : process.env.FRONTEND_URL_LOCAL,
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
