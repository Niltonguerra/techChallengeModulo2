import { ReturnListPostDTO } from './../../../../dist/modules/post/DTOs/returnlistPost.DTO.d';
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
    private readonly userService: UserService,
  ) {}

  async execute(query: ListPostDTO): Promise<ReturnListPost> {
    try {
      const posts = await this.postService.listPosts(query.search, query.offset, query.limit);

      const dataResponse: ReturnListPost = {
        total: posts.length,
        limit: query.limit ?? 10,
        offset: query.offset ?? 0,
        ListPost: [],
      };

      for (const post of posts) {
        const user = await this.userService.findOneUser('id', post.user_id);
        const data: ListPost = {
          ...post,
          user_name: user.user.name,
          user_email: user.user.email,
          user_social_media: user.user.social_midia,
        };
        dataResponse.ListPost.push(data);
      }

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
