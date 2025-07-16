import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostService } from '../post.service';
import { UserService } from '@modules/user/service/user.service';
import { systemMessage } from '@config/i18n/pt/systemMessage';


@Injectable()
export class GetPostUseCase {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  async getPostUseCaseById(id: string): Promise<any> {
    try {
      const post = await this.postService.getById(id);

      const user = await this.userService.findOneUser('id', post.user_id);

      const ReturnMessage: any = {
        ...post,
        user_name: user.user.name,
        user_email: user.user.email,
        user_social_media: user.user.social_midia,
        total_post: 1,
      };
      return ReturnMessage;
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : systemMessage.ReturnMessage.errorGetPostById;
      throw new HttpException(
        `Erro ao buscar o post: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
