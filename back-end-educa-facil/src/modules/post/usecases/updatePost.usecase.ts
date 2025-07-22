import { Body, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PostService } from '../service/post.service';
import { UpdatePostDTO } from '../dtos/updatePost.dto';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { systemMessage } from '@config/i18n/pt/systemMessage';

@Injectable()
export class UpdatePostUseCase {
  private readonly logger = new Logger(UpdatePostUseCase.name);
  constructor(private readonly postService: PostService) {}

  async UpdatePostUseCase(updatePostData: UpdatePostDTO): Promise<ReturnMessageDTO> {
    try {
      const post = await this.postService.UpdatePostService(updatePostData);
      return post;
    } catch (error) {
      const message =
        error instanceof HttpException
          ? error.message
          : systemMessage.ReturnMessage.errorUpdatePost;
      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }
  }
}
