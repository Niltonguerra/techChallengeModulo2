import { Body, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PostService } from '../post.service';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { searchByFieldPostEnum } from '../enum/searchByFieldPost.enum';
import { CreatePostDTO } from '../DTOs/createPost.DTO';

@Injectable()
export class CreatePostUseCase {
  private readonly logger = new Logger(CreatePostUseCase.name);
  constructor(private readonly postService: PostService) {}

  async createPostUseCase(createPostData: CreatePostDTO): Promise<ReturnMessageDTO> {
    try {
      const validadeName = await this.postService.getByField(
        searchByFieldPostEnum.TITLE,
        createPostData.title,
      );

      if (validadeName.statusCode === 200) {
        const message = systemMessage.ReturnMessage.existePostWithThisTitle;
        const status = HttpStatus.NOT_FOUND;
        this.logger.error(`${message}: ${status}`);
        throw new HttpException(`${message}: ${status}`, status);
      }

      const post = await this.postService.createPostService(createPostData);
      return post;
    } catch (error) {
      const message =
        error instanceof HttpException
          ? error.message
          : systemMessage.ReturnMessage.errorCreatePost;
      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }
  }
}
