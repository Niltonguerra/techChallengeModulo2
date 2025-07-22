import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PostService } from '../service/post.service';
import { ListPostDTO } from '../dtos/listPost.dto';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ReturnListPost } from '../dtos/returnlistPost.dto';

@Injectable()
export class ListPostUseCase {
  private readonly logger = new Logger(ListPostUseCase.name);
  constructor(private readonly postService: PostService) {}

  async execute(query: ListPostDTO): Promise<ReturnListPost> {
    try {
      const posts = await this.postService.listPosts(query.search, query.offset, query.limit);
      return posts;
    } catch (error) {
      const message =
        error instanceof HttpException ? error.message : systemMessage.ReturnMessage.errorGetPosts;
      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }
  }
}
