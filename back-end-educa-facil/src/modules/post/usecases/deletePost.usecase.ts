import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PostService } from '../post.service';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';

@Injectable()
export class DeletePostUseCase {
  private readonly logger = new Logger(DeletePostUseCase.name);
  constructor(private readonly postService: PostService) {}

  async deletePostUseCase(id: string): Promise<ReturnMessageDTO> {
    try {
      return await this.postService.deletePostService(id);
    } catch (error) {
      const message =
        error instanceof HttpException
          ? error.message
          : systemMessage.ReturnMessage.errorDeletePost;
      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }
  }
}
