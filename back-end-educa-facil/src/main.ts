import { webcrypto } from 'crypto';
(globalThis as { crypto: Crypto }).crypto = webcrypto as Crypto;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupDocumentation } from '@config/documentation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupDocumentation(app);
  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.PORT ?? 3000);
  console.log('==========================');
  console.log('===== Tech Challenge =====');
  console.log(`=====   Vs.: 1.0.0   =====`);
  console.log(`=====   Port: 3000   =====`);
  console.log('==========================');
}
void bootstrap();
