import { systemMessage } from '@config/i18n/pt/systemMessage';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ListPostDTO } from '../dtos/listPost.dto';
import { ReturnListPost } from '../dtos/returnlistPost.dto';
import { PostService } from '../service/post.service';

@Injectable()
export class ListPostUseCase {
  private readonly logger = new Logger(ListPostUseCase.name);
  constructor(private readonly postService: PostService) {}

  async execute(query: ListPostDTO): Promise<ReturnListPost> {
    try {
      const posts = await this.postService.listPosts(query); //<<
      return posts;
    } catch (error) {
      this.logger.error('Erro em listPosts:', error);
      return {
        message:
          error instanceof HttpException
            ? error.message
            : systemMessage.ReturnMessage.errorGetPosts,
        statusCode:
          error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
        limit: 10,
        offset: 0,
        total: 0,
        ListPost: [],
      };
    }
  }
}
