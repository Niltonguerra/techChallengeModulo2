import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PostService } from '../service/post.service';

@Injectable()
export class GetUniqueHashtagsUseCase {
  private readonly logger = new Logger(GetUniqueHashtagsUseCase.name);
  constructor(private readonly postService: PostService) { }

  async execute(): Promise<string[]> {
    try {
      const post = await this.postService.getUniqueHashtags();
      return post;
    } catch (error) {
      console.log(error);
      const message = `${error}`;
      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}`, status);
    }
  }
}
