import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDTO } from './dtos/createPost.DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePostDTO } from './dtos/updatePost.DTO';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { GetPostService } from './dtos/getPostService.DTO';
import { Like } from 'typeorm';
import { UserService } from '@modules/user/service/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
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

  async listPosts(search?: string, offset = 0, limit = 10): Promise<GetPostService[]> {
    const where = search
      ? [{ title: Like(`%${search}%`) }, { description: Like(`%${search}%`) }]
      : {};

    const [posts, total_post] = await this.postRepository.findAndCount({
      where,
      skip: offset,
      take: limit,
      order: { created_at: 'DESC' },
    });

    await this.postRepository
      .createQueryBuilder('qs')
      .select([
        'qs.name as user_name',
        'qs.email as user_email',
        'qs.social_midia as user_social_media',
      ])
      .innerJoin('uf', 'uf', 'uf.countryId = cr.id')
      .innerJoin('city', 'cy', 'cy.ufId = uf.id')
      .innerJoin('showcase', 'sc', 'sc.cityId = cy.id')
      .where('sc.inactive = :inactive', { inactive: 0 });

    const totalPosts: GetPostService[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      search: post.search ?? '',
      introduction: post.description?.substring(0, 100) || '',
      external_link: post.external_link ?? '',
      content_hashtags: post.content_hashtags,
      style_id: post.style_id ?? '',
      image: post.image ?? '',
      created_at: post.created_at,
      updated_at: post.updated_at,
      total_post,
      user_id: post.user_id,
    }));
    return totalPosts;
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

  async getById(id: string): Promise<GetPostService> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new HttpException(systemMessage.ReturnMessage.errorGetPostById, 404);
    }
    const postDataReturn: GetPostService = {
      id: post.id,
      title: post.title,
      description: post.description,
      search: post.search ?? '',
      introduction: post.introduction ?? '',
      external_link: post.external_link,
      content_hashtags: post.content_hashtags,
      style_id: post.style_id,
      image: post.image ?? '',
      created_at: post.created_at,
      updated_at: post.updated_at,
      user_id: post.user_id,
    };

    return postDataReturn;
  }
}
