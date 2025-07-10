import { Injectable } from '@nestjs/common';
import { PostService } from '../post.service';
import { ListPostDTO } from '../DTOs/listPost.DTO';
import { ReturnListPostDTO } from '../DTOs/returnlistPost.DTO';

@Injectable()
export class listPostUseCase {
  constructor(private readonly postService: PostService) {}

  async execute(query: ListPostDTO): Promise<ReturnListPostDTO[]> {
    const offset = query.offset ? parseInt(query.offset, 10) : 0;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;

    return this.postService.listPosts(offset, limit, query.search);
  }
}
