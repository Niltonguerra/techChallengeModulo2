import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostModule } from '@modules/post/post.module';
import { Post } from '@modules/post/entities/post.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host:
          config.get<string>('AMBIENTE') === 'PROD'
            ? config.get<string>('DB_HOST_PROD')
            : config.get<string>('DB_HOST_DEV'),
        port: parseInt(config.get<string>('DB_PORT') ?? '5432', 10),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        autoLoadEntities: config.get<string>('AMBIENTE') === 'PROD' ? false : true,
        synchronize: config.get<string>('AMBIENTE') === 'PROD' ? false : true,
        entities: [Post],
      }),
    }),
    PostModule,
  ],
})
export class AppModule {}
