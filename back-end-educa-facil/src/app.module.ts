import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostModule } from '@modules/post/post.module';
import { Post } from '@modules/post/entities/post.entity';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { EmailModule } from '@modules/email/email.module';
import { User } from '@modules/user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        if (config.get<string>('AMBIENTE') === 'PROD') {
          return {
            type: 'postgres',
            host: config.get<string>('DB_HOST_PROD'),
            port: config.get<number>('DB_PORT_PROD'),
            username: config.get<string>('DB_USERNAME_PROD'),
            password: config.get<string>('DB_PASSWORD_PROD'),
            database: config.get<string>('DB_DATABASE_PROD'),
            autoLoadEntities: true,
            synchronize: true,
            ssl: true,
            extra: { ssl: { rejectUnauthorized: false } },
            entities: [Post, User],
          };
        } else {
          return {
            type: 'postgres',
            host: config.get<string>('DB_HOST_DEV'),
            port: config.get<number>('DB_PORT_DEV'),
            username: config.get<string>('DB_USERNAME_DEV'),
            password: config.get<string>('DB_PASSWORD_DEV'),
            database: config.get<string>('DB_DATABASE_DEV'),
            autoLoadEntities: true,
            synchronize: true,
            entities: [Post, User],
          };
        }
      },
    }),
    PostModule,
    UserModule,
    AuthModule,
    EmailModule,
  ],
})
export class AppModule {}
