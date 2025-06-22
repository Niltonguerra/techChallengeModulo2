import { Injectable } from '@nestjs/common';
import { CreateReturnMessageDTO } from './DTOs/returnMessage.DTO';
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPostService(createPostData: CreatePostDTO): Promise<CreateReturnMessageDTO> {
    const post = this.postRepository.create({ id: uuidv4(), ...createPostData });

    await this.postRepository.save(post);
    const returnService: CreateReturnMessageDTO = {
      message: 'Post criado com sucesso',
      statusCode: '200',
    };
    return returnService;
  }

  async listar(): Promise<Post[]> {
    return this.postRepository.find();
  }
}
