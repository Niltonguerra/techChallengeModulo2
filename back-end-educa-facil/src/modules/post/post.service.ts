import { HttpException, Injectable, Logger } from '@nestjs/common';
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
import { ListPost } from './dtos/returnlistPost.DTO';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
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

  async listPosts(search?: string, offset = 0, limit = 10): Promise<any> {
    const where = search
      ? [{ title: Like(`%${search}%`) }, { description: Like(`%${search}%`) }]
      : {};

    // const [posts, total_post] = await this.postRepository.findAndCount({
    //   where,
    //   skip: offset,
    //   take: limit,
    //   order: { created_at: 'DESC' },
    // });

    // posts = await this.postRepository
    //   .createQueryBuilder('p')
    //   .select([
    //     'p.id',
    //     'p.title',
    //     'p.description',
    //     'p.search',
    //     'p.introduction',
    //     'p.external_link',
    //     'p.content_hashtags',
    //     'p.style_id',
    //     'p.image', 
    //     'p.created_at',
    //     'p.updated_at',
    //     'p.social_midia',
    //     'u.name AS user_name',
    //     'u.email AS user_email',
    //     'u.social_media AS user_social_media'
    //   ])
    //   .innerJoin('user', 'u', 'u.id = p.user_id');
      // .where('sc.inactive = :inactive', { inactive: 0 });

    // const totalPosts: ListPost[] = posts.map((post) => ({
    //   id: post.id,
    //   title: post.title,
    //   description: post.description,
    //   search: post.search ?? '',
    //   introduction: post.description?.substring(0, 100) || '',
    //   external_link: post.external_link ?? '',
    //   content_hashtags: post.content_hashtags,
    //   style_id: post.style_id ?? '',
    //   image: post.image ?? '',
    //   created_at: post.created_at,
    //   updated_at: post.updated_at,
    //   user_name: post.;
    //   user_email: post.user;
    //   user_social_media

    // }));
    const [posts, total_post] = await this.postRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'u')
      .select(['p', 'u'])
      .getManyAndCount();

    // .query(`
    //   SELECT
    //     p.id,
    //     p.title,
    //     p.description,
    //     p.search,
    //     p.introduction,
    //     p.external_link,
    //     p.content_hashtags,
    //     p.style_id,
    //     p.image,
    //     p.created_at,
    //     p.updated_at,
    //     u.name AS user_name,
    //     u.email AS user_email,
    //     u.social_midia AS user_social_media
    //   FROM
    //     public."Post" p
    //   LEFT JOIN
    //     public."User" u ON u.id = p.user_id

    //   ORDER BY
    //     p.created_at DESC
    //   OFFSET
    //     ${offset}
    //   LIMIT
    //     ${limit};
    //   `)
      
    // .createQueryBuilder('p')
    //   .leftJoin('p.user', 'u')
    //   .select([
    //     'p.id',
    //     'p.title',
    //     'p.description',
    //     'p.search',
    //     'p.introduction',
    //     'p.external_link',
    //     'p.content_hashtags',
    //     'p.style_id',
    //     'p.image',
    //     'p.created_at',
    //     'p.updated_at',
    //     'u.name AS user_name',
    //     'u.email AS user_email',
    //     'u.social_midia AS user_social_media'
    //   ])
    //   // .leftJoin('User', 'u', 'u.id = p.user_id')
    //   // .leftJoin('p.user', 'u')

    //   .where(where)
    //   .orderBy('p.created_at', 'DESC')
    //   .skip(offset)
    //   .take(limit)
    //   .getManyAndCount();
    this.logger.debug(posts);
    this.logger.debug(total_post);
    
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
      user_id: ''
    };

    return postDataReturn;
  }
}
