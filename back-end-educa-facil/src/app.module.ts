import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LivroModule } from './livro/livro.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Livro } from './livro/livro.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis disponíveis globalmente
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host:
          config.get<string>('AMBIENTE') === 'DEV'
            ? config.get<string>('DB_HOST_DEV')
            : config.get<string>('DB_HOST_PROD'),
        port: parseInt(config.get<string>('DB_PORT') ?? '5432', 10),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        autoLoadEntities: config.get<string>('AMBIENTE') === 'DEV' ? true : false,
        synchronize: config.get<string>('AMBIENTE') === 'DEV' ? true : false,
        entities: [Livro],
      }),
    }),
    LivroModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
