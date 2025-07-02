import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostService } from '../post.service';
import { GetPostDTO } from '../DTOs/getPost.DTO';

@Injectable()
export class GetPostUseCase {
  constructor(private readonly postService: PostService) {}

  async getPostUseCaseById(id: string): Promise<GetPostDTO[]> {
    try {
      return await this.postService.getById(id);
    } catch (error) {
      throw new HttpException(`Erro ao buscar o post: ${error.message}`, 500);
    }
  }

}
