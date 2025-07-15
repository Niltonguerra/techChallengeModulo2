import { Injectable } from '@nestjs/common';
import { PostService } from '../post.service';
import { ListPostDTO } from '../DTOs/listPost.DTO';
import { ReturnListPostDTO } from '../DTOs/returnlistPost.DTO';

@Injectable()
export class listPostUseCase {
  constructor(private readonly postService: PostService) {}

  async execute(query: ListPostDTO): Promise<ReturnListPostDTO[]> {
    return this.postService.listPosts(query.offset, query.limit, query.search);
  }
}
