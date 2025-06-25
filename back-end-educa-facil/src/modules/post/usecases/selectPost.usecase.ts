import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostService } from '../post.service';
import { SelectPostDTO } from '../DTOs/select.DTO';

@Injectable()
export class SelectPostUseCase {
  constructor(private readonly postService: PostService) {}

  async selectPostUseCaseById(id: string): Promise<SelectPostDTO[]> {
    try {
      return await this.postService.getById(id);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido ao retornar';
      throw new HttpException(
        `Erro ao criar ao buscar post: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
