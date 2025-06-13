import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LivroModule } from './livro/livro.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'nest_user',
      password: 'nest_password',
      database: 'nest_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    LivroModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
