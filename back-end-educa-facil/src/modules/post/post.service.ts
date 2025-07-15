import { Injectable } from '@nestjs/common';
import { CreatePostDTO } from './dtos/createPost.DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePostDTO } from './DTOs/updatePost.DTO';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { GetPostDTO } from './DTOs/getPost.DTO';
import { Like } from 'typeorm';
import { ReturnListPostDTO } from './DTOs/returnlistPost.DTO';



@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPostService(createPostData: CreatePostDTO): Promise<ReturnMessageDTO> {
    const post = this.postRepository.create({ id: uuidv4(), ...createPostData });

    await this.postRepository.save(post);
    const returnService: ReturnMessageDTO = {
      message: systemMessage.ReturnMessage.sucessCreatePost,
      statusCode: 200,
    };
    return returnService;
  }

  async listPosts(offset = 0, limit = 10, search?: string): Promise<ReturnListPostDTO[]> {
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
      external_link: '', 
      content_hashtags: [], 
      style_id: '', 
      image: post.image,
      created_at: post.created_at,
      updated_at: post.updated_at,
      total_post,
      author_id: {
        name: '', 
        email: '',
        social_midia: '',
      },
    }));
  }
async UpdatePostService(updatePostData: UpdatePostDTO): Promise<ReturnMessageDTO> {
    const post = await this.postRepository.findOneBy({ id: updatePostData.id });

    if (!post) {
      throw new Error('Post não encontrado');
    }

    Object.assign(post, updatePostData);
    await this.postRepository.save(post);

    const returnService: ReturnMessageDTO = {
      message: 'Post atualizado com sucesso',
      statusCode: 200,
    };
    return returnService;
  }

  async listar(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async getById(id: string): Promise<GetPostDTO> {
  const post = await this.postRepository.findOne({ where: { id } });

  if (!post) throw new Error('Post não encontrado');

  return {
    title: post.title,
    description: post.description,
    search_field: post.search_field,
    introduction: post.introduction,
    external_link: post.external_link,
    content_hashtags: post.content_hashtags,
    style_id: post.style_id,
    image: post.image,
    created_at: post.created_at,
    updated_at: post.updated_at,
    author_name: '', 
    author_email: '', 
  };
}
}
