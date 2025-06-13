import { TypeOrmModule } from '@nestjs/typeorm';
import { Livro } from './livro.entity';
import { Module } from '@nestjs/common';
import { LivroService } from './livro.service';
import { LivroController } from './livro.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Livro])],
  providers: [LivroService],
  controllers: [LivroController],
})
export class LivroModule {}
