import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { User } from '@modules/user/entities/user.entity';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreatePostDTO } from '../dtos/createPost.dto';
import { ListPostDTO } from '../dtos/listPost.dto';
import { ReturnListPost } from '../dtos/returnlistPost.dto';
import { UpdatePostDTO } from '../dtos/updatePost.dto';
import { Post } from '../entities/post.entity';
import { PostStatusEnum } from '../controller/enum/status.enum';
import { UserStatusEnum } from '@modules/user/enum/status.enum';

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

  async listPosts(listPostData: ListPostDTO): Promise<ReturnListPost> {
    const offsetNumber = listPostData?.offset ? Number(listPostData.offset) : 0;
    const limitNumber = listPostData?.limit ? Number(listPostData.limit) : 10;

    const {
      search,
      content: contentHashtags,
      userId,
      createdAtBefore,
      createdAtAfter,
    } = listPostData;

    const query = this.postRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'u')
      .select(['p', 'u'])
      .orderBy('p.created_at', 'DESC')
      .skip(offsetNumber)
      .take(limitNumber);

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

    if (userId) {
      query.andWhere('p.user_id = :userId', { userId });
    }

    if (contentHashtags && contentHashtags.length > 0) {
      const tags = Array.isArray(contentHashtags) ? contentHashtags : [contentHashtags];
      query.andWhere('p.content_hashtags && :tags::varchar[]', { tags });
    }

    if (createdAtBefore) {
      const auxDate = new Date(createdAtBefore);
      if (!isNaN(auxDate.getTime())) {
        const formattedDate = auxDate.toISOString().split('T')[0];
        query.andWhere('DATE(p.created_at) <= :createdAtBefore', {
          createdAtBefore: formattedDate,
        });
      }
    }

    if (createdAtAfter) {
      const auxDate = new Date(createdAtAfter);
      if (!isNaN(new Date(createdAtAfter).getTime())) {
        const formattedDate = auxDate.toISOString().split('T')[0];
        query.andWhere('p.created_at >= :createdAtAfter', {
          createdAtAfter: formattedDate,
        });
      }
    }
    query.andWhere('p.is_active <= :is_active', {
      is_active: PostStatusEnum.ACTIVE,
    });
    const [posts, total_post] = await query.getManyAndCount();

    const postDataReturn: ReturnListPost = {
      message: systemMessage.ReturnMessage.sucessGetPosts,
      statusCode: 200,
      limit: limitNumber,
      offset: offsetNumber,
      total: total_post,
      ListPost: posts.map((p) => {
        const userData =
          p.user?.is_active === UserStatusEnum.INACTIVE
            ? {
                name: 'Autor indisponível',
                email: 'Autor indisponível',
                photo: null,
              }
            : {
                name: p.user?.name,
                email: p.user?.email,
                photo: p.user?.photo,
              };
        return {
          id: p.id,
          title: p.title,
          description: p.description,
          image: p.image,
          introduction: p.introduction ?? (p.description?.substring(0, 100) || ''),
          content_hashtags: p.content_hashtags,
          external_link: p.external_link ?? { url: '' },
          created_at: p.created_at,
          updated_at: p.updated_at,
          user_name: userData.name,
          user_email: userData.email,
          user_photo: userData.photo,
        };
      }),
    };
    return postDataReturn;
  }

  async updatePostService(updatePostData: UpdatePostDTO): Promise<ReturnMessageDTO> {
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
      .andWhere('p.is_active = :active', { active: PostStatusEnum.ACTIVE })
      .getOne();

    if (!post) {
      const message = systemMessage.ReturnMessage.errorGetPostById;
      const status = HttpStatus.NOT_FOUND;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }

    const userData =
      post.user?.is_active === UserStatusEnum.INACTIVE
        ? {
            name: 'Autor indisponível',
            email: 'Autor indisponível',
            photo: null,
          }
        : {
            name: post.user.name,
            email: post.user.email,
            photo: post.user.photo,
          };

    const postDataReturn: ReturnListPost = {
      message: systemMessage.ReturnMessage.sucessGetPostById,
      statusCode: 200,
      limit: 10,
      offset: 0,
      total: 1,
      ListPost: [
        {
          id: post.id,
          title: post.title,
          description: post.description,
          image: post.image,
          introduction: post.introduction ?? (post.description?.substring(0, 100) || ''),
          content_hashtags: post.content_hashtags,
          external_link: post.external_link ?? { url: '' },
          created_at: post.created_at,
          updated_at: post.updated_at,
          user_name: userData.name,
          user_email: userData.email,
          user_photo: userData.photo,
        },
      ],
    };
    return postDataReturn;
  }

  async deletePostService(id: string): Promise<ReturnMessageDTO> {
    const result = await this.postRepository.update(
      { id: id },
      {
        is_active: PostStatusEnum.INACTIVE,
        updated_at: new Date(),
      },
    );
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

  async getUniqueHashtags(): Promise<string[]> {
    const result: { hashtag: string }[] = await this.postRepository
      .createQueryBuilder('p')
      .select('DISTINCT unnest(p.content_hashtags)', 'hashtag')
      .where('p.content_hashtags IS NOT NULL')
      .andWhere('p.is_active <= :is_active', { is_active: PostStatusEnum.ACTIVE })
      .limit(10)
      .getRawMany();
    return result.map((row) => row.hashtag);
  }
}
