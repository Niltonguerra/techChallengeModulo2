import { HttpException, Injectable } from '@nestjs/common';
import { PostService } from '../post.service';
import { GetPostDTO } from '../DTOs/getPost.DTO';

@Injectable()
export class GetPostUseCase {
  constructor(private readonly postService: PostService) {}

  async getPostUseCaseById(id: string): Promise<GetPostDTO[]> {
    try {
      return await this.postService.getById(id);
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new HttpException(`Erro ao buscar o post: ${mensagemErro}`, 500);
    }
  }
}
