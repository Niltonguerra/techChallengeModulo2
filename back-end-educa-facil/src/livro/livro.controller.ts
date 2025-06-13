import { Controller, Post, Get, Body } from '@nestjs/common';
import { LivroService } from './livro.service';
import { Livro } from './livro.entity';

@Controller('livros')
export class LivroController {
  constructor(private readonly livroService: LivroService) {}

  @Post()
  async criar(@Body('titulo') titulo: string): Promise<Livro> {
    return this.livroService.criar(titulo);
  }

  @Get()
  async listar(): Promise<Livro[]> {
    return this.livroService.listar();
  }
}
