
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostService } from '../post.service';
import { ListPostDTO } from '../dtos/listPost.DTO';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { UserService } from '@modules/user/service/user.service';
import { ListPost, ReturnListPost } from '../dtos/returnlistPost.DTO';

@Injectable()
export class listPostUseCase {
  constructor(
    private readonly postService: PostService,
  ) {}

  async execute(query: ListPostDTO): Promise<ReturnListPost> {
    try {
      const posts = await this.postService.listPosts(query.search, query.offset, query.limit);

      const dataResponse: ReturnListPost = {
        total: 2,
        limit: query.limit ?? 10,
        offset: query.offset ?? 0,
        ListPost: posts,
      };

      return dataResponse;
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : systemMessage.ReturnMessage.errorGetPosts;
      throw new HttpException(
        `Erro ao buscar o post: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
