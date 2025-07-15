// src/docs/documentation.ts
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import redoc from 'redoc-express';

export function setupDocumentation(app: INestApplication) {
  const protectedPaths = ['/swagger-ui', '/docs', '/api-json'];
  const basicAuth = require('express-basic-auth');

  if (!process.env.SWAGGER_USER || !process.env.SWAGGER_PASS) {
    throw new Error('As variáveis SWAGGER_USER e SWAGGER_PASS devem estar definidas');
  }

  app.use(
    protectedPaths,
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASS,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Educa Facil')
    .setDescription('Documentação da API com Swagger e ReDoc')
    .setVersion('1.0')
    .addBearerAuth( {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Informe o token JWT',
      in: 'header',
    },
    'JWT-Auth',)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document);

  app.use(
    '/docs',
    redoc({
      title: 'Educa Facil API',
      specUrl: '/api-json',
    }),
  );

  app.use('/api-json', (req, res) => {
    res.send(document);
  });
}
