import { webcrypto } from 'crypto';
(globalThis as { crypto: Crypto }).crypto = webcrypto as Crypto;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
