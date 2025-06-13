import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Livro } from './livro.entity';

@Injectable()
export class LivroService {
  constructor(
    @InjectRepository(Livro)
    private readonly livroRepository: Repository<Livro>,
  ) {}

  async criar(titulo: string): Promise<Livro> {
    const livro = this.livroRepository.create({ titulo });
    return this.livroRepository.save(livro);
  }

  async listar(): Promise<Livro[]> {
    return this.livroRepository.find();
  }
}
