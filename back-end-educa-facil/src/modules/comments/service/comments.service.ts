import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { Post } from '@modules/post/entities/post.entity';
import { User } from '@modules/user/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { PaginateDTO } from '../dto/get-comment.dto';
import { ListCommentDTO } from '../dto/return-comment.dto';
import { Comments } from '../entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly repository: Repository<Comments>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async delete(id: string): Promise<ReturnMessageDTO> {
    const comment = await this.repository.findOne({ where: { id: id } });
    if (!comment) {
      return {
        statusCode: 404,
        message: systemMessage.ReturnMessage.errorCommentNotFound,
      };
    }
    await this.repository.remove(comment);
    return {
      statusCode: 200,
      message: systemMessage.ReturnMessage.successDeleteComment,
    };
  }

  async create(createCommentDTO: CreateCommentDTO, userId: string): Promise<ReturnMessageDTO> {
    const { content, postId } = createCommentDTO;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(systemMessage.ReturnMessage.errorUserNotFound);

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException(systemMessage.ReturnMessage.errorPostNotFound);

    const comment = this.repository.create({
      content,
      user,
      post,
    });

    await this.repository.save(comment);

    return {
      statusCode: 200,
      message: systemMessage.ReturnMessage.successCreatedComment,
    };
  }

  async findByPostId(postId: string, paginate: PaginateDTO): Promise<ListCommentDTO[]> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException(systemMessage.ReturnMessage.errorPostNotFound);

    const comments = await this.repository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: Number(paginate.offset) || 0,
      take: Number(paginate.limit) || 10,
    });

    return comments.map((c: Comments) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      user: {
        id: c.user?.id,
        name: c.user?.name,
        photo: c.user?.photo,
      },
    }));
  }
}
