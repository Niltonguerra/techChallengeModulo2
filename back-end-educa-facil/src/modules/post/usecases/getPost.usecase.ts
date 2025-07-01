import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostService } from '../post.service';
import { GetPostDTO } from '../DTOs/getPost.DTO';

@Injectable()
export class GetPostUseCase {
  constructor(private readonly postService: PostService) {}

  async getPostUseCaseById(id: string): Promise<GetPostDTO[]> {
    try {
      return this.postService.getById(id);
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
