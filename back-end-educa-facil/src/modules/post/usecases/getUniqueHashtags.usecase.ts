import { systemMessage } from '@config/i18n/pt/systemMessage';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PostService } from '../service/post.service';

@Injectable()
export class GetUniqueHashtagsUseCase {
  private readonly logger = new Logger(GetUniqueHashtagsUseCase.name);
  constructor(private readonly postService: PostService) {}

  async execute(): Promise<string[]> {
    try {
      const post = await this.postService.getUniqueHashtags();
      return post;
    } catch (error) {
      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

      const message =
        error instanceof HttpException
          ? error.message
          : `${systemMessage.ReturnMessage.errorGetPosts}`;

      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }
  }
}
