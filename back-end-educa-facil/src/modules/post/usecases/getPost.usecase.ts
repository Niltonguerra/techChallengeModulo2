import { systemMessage } from '@config/i18n/pt/systemMessage';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ReturnListPost } from '../dtos/returnlistPost.dto';
import { PostService } from '../service/post.service';

@Injectable()
export class GetPostUseCase {
  private readonly logger = new Logger(GetPostUseCase.name);
  constructor(private readonly postService: PostService) { }

  async getPostUseCaseById(id: string): Promise<ReturnListPost> {
    try {
      const post = await this.postService.getById(id);
      return post;
    } catch (error) {
      const message =
        error instanceof HttpException
          ? error.message
          : systemMessage.ReturnMessage.errorGetPostById;
      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }
  }
}
