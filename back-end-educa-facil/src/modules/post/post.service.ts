import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReturnMessageDTO, DeleteReturnMessageDTO } from './DTOs/returnMessage.DTO';
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { systemMessage } from '@config/i18n/pt/systemMessage';

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
      message: systemMessage.ReturnMessage.sucessPost,
      statusCode: 200,
    };
    return returnService;
  }

  async listar(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async deletePostService(id: string): Promise<DeleteReturnMessageDTO> {
    const iDpost = await this.postRepository.findOne({ where: { id } });
    if (!iDpost) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    await this.postRepository.remove(iDpost);
    const returnMessage: DeleteReturnMessageDTO = {
      message: systemMessage.ReturnMessage.sucessDeletePost,
      statusCode: 200,
    };
    return returnMessage;
  }

}

