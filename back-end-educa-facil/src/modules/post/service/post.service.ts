import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePostDTO } from '../dtos/updatePost.dto';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { ReturnListPost } from '../dtos/returnlistPost.dto';
import { searchByFieldPostEnum } from '../enum/searchByFieldPost.enum';
import { CreatePostDTO } from '../dtos/createPost.dto';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPostService(createPostData: CreatePostDTO): Promise<ReturnMessageDTO> {
    const validadeName = await this.postRepository.findOneBy({ title: createPostData.title });

    if (validadeName) {
      const message = systemMessage.ReturnMessage.existePostWithThisTitle;
      const status = HttpStatus.NOT_FOUND;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }

    const post = this.postRepository.create({
      id: uuidv4(),
      ...createPostData,
      user: { id: createPostData.user_id } as User,
    });
    await this.postRepository.save(post);

    const returnService: ReturnMessageDTO = {
      message: systemMessage.ReturnMessage.sucessCreatePost,
      statusCode: 200,
    };

    return returnService;
  }

  async listPosts(search?: string, offset = 0, limit = 10): Promise<ReturnListPost> {
    const query = this.postRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'u')
      .select(['p', 'u'])
      .orderBy('p.created_at', 'DESC')
      .skip(offset)
      .take(limit);

    if (search?.trim()) {
      const terms = search
        .split(',')
        .map((term) => term.trim())
        .filter((term) => term.length > 0);

      if (terms.length > 0) {
        const conditions: string[] = [];
        const parameters = {};
        terms.forEach((term, index) => {
          conditions.push(`p.search ILIKE :term${index}`);
          parameters[`term${index}`] = `%${term}%`;
        });
        const whereClause = conditions.join(' OR ');
        query.where(whereClause, parameters);
      }
    }
    const [posts, total_post] = await query.getManyAndCount();

    const postDataReturn: ReturnListPost = {
      message: systemMessage.ReturnMessage.sucessGetPosts,
      statusCode: 200,
      limit,
      offset,
      total: total_post,
      ListPost: posts.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        image: p.image,
        introduction: p.introduction ?? (p.description?.substring(0, 100) || ''),
        content_hashtags: p.content_hashtags,
        style_id: p.style_id ?? '',
        external_link: p.external_link ?? { url: '' },
        created_at: p.created_at,
        updated_at: p.updated_at,
        user_name: p.user?.name,
        user_email: p.user?.email,
        user_social_media: p.user?.social_midia,
      })),
    };
    return postDataReturn;
  }

  async UpdatePostService(updatePostData: UpdatePostDTO): Promise<ReturnMessageDTO> {
    const post = await this.postRepository.findOneBy({ id: updatePostData.id });

    if (!post) {
      const message = systemMessage.ReturnMessage.errorUpdatePost;
      const status = HttpStatus.NOT_FOUND;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }

    Object.assign(post, updatePostData);
    await this.postRepository.save(post);

    const returnService: ReturnMessageDTO = {
      message: systemMessage.ReturnMessage.sucessUpdatePost,
      statusCode: 200,
    };

    return returnService;
  }

  async getById(id: string): Promise<ReturnListPost> {
    const post: Post | null = await this.postRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'u')
      .select(['p', 'u'])
      .where('p.id = :id', { id })
      .getOne();

    if (!post) {
      const message = systemMessage.ReturnMessage.errorGetPostById;
      const status = HttpStatus.NOT_FOUND;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }

    const postDataReturn: ReturnListPost = {
      message: systemMessage.ReturnMessage.sucessGetPostById,
      statusCode: 200,
      limit: 10,
      offset: 0,
      total: 1,
      ListPost: {
        id: post.id,
        title: post.title,
        description: post.description,
        image: post.image,
        introduction: post.introduction ?? (post.description?.substring(0, 100) || ''),
        content_hashtags: post.content_hashtags,
        style_id: post.style_id ?? '',
        external_link: post.external_link ?? { url: '' },
        created_at: post.created_at,
        updated_at: post.updated_at,
        user_name: post.user.name,
        user_email: post.user.email,
        user_social_media: post.user.social_midia,
      },
    };
    return postDataReturn;
  }

  async getByField(field: searchByFieldPostEnum, value: string): Promise<ReturnListPost> {
    const post: Post | null = await this.postRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'u')
      .select(['p', 'u'])
      .where(`p.${field} = :value`, { value })
      .getOne();

    if (!post) {
      const postDataReturn: ReturnListPost = {
        message: systemMessage.ReturnMessage.errorGetPostByField,
        statusCode: 404,
      };
      return postDataReturn;
    }

    const postDataReturn: ReturnListPost = {
      message: systemMessage.ReturnMessage.sucessGetPostByField,
      statusCode: 200,
      limit: 10,
      offset: 0,
      total: 1,
      ListPost: {
        id: post.id,
        title: post.title,
        description: post.description,
        image: post.image,
        introduction: post.introduction ?? (post.description?.substring(0, 100) || ''),
        content_hashtags: post.content_hashtags,
        style_id: post.style_id ?? '',
        external_link: post.external_link ?? { url: '' },
        created_at: post.created_at,
        updated_at: post.updated_at,
        user_name: post.user.name,
        user_email: post.user.email,
        user_social_media: post.user.social_midia,
      },
    };
    return postDataReturn;
  }

  async deletePostService(id: string): Promise<ReturnMessageDTO> {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      const message = systemMessage.ReturnMessage.errorDeletePost;
      const status = HttpStatus.NOT_FOUND;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }
    return {
      message: systemMessage.ReturnMessage.sucessDeletePost,
      statusCode: 200,
    };
  }
}
