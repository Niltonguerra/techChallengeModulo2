import { Injectable } from '@nestjs/common';
import { CreateReturnMessageDTO } from './DTOs/returnMessage.DTO';
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePostDTO } from './DTOs/updatePost.DTO';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { GetPostDTO } from './DTOs/getPost.DTO';


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

  async UpdatePostService(updatePostData: UpdatePostDTO): Promise<CreateReturnMessageDTO> {
    const post = await this.postRepository.findOneBy({ id: updatePostData.id });

    if (!post) {
      throw new Error('Post não encontrado');
    }

    Object.assign(post, updatePostData);
    await this.postRepository.save(post);

    const returnService: CreateReturnMessageDTO = {
      message: 'Post atualizado com sucesso',
      statusCode: '200',
    };
    return returnService;
  }

  async listar(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async getById(id: string): Promise<GetPostDTO[]> {
    return this.postRepository.find({ where: { id: id } });
  }
}
