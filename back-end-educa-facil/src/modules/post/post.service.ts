import { Injectable } from '@nestjs/common';
import { CreateReturnMessageDTO } from './DTOs/returnMessage.DTO';
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { Like } from 'typeorm';
import { ReturnListPostDTO } from './DTOs/returnlistPost.DTO';


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

  async listPosts(offset: number, limit: number, search?: string): Promise<ReturnListPostDTO[]> {
    const where = search
      ? [
          { title: Like(`%${search}%`) },
          { description: Like(`%${search}%`) },
        ]
      : {};

    const [posts, total_post] = await this.postRepository.findAndCount({
      where,
      skip: offset,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return posts.map(post => ({
      title: post.title,
      description: post.description,
      introduction: post.description?.substring(0, 100) || '',
      external_link: '', // Completar se necessário
      content_hashtags: [], // Completar se necessário
      style_id: '', // Completar se necessário
      image: post.image,
      createdAt: post.created_at, // corrigido aqui
      updatedAt: post.updated_at, // corrigido aqui
      total_post,
      author_id: {
        name: '', // Incluir dados se houver relação com User
        email: '',
        social_midia: '',
      },
    }));
  }

  async listar(): Promise<Post[]> {
    return this.postRepository.find();
  }
}
