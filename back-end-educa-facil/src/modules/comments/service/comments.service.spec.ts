import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { Post } from '@modules/post/entities/post.entity';
import { User } from '@modules/user/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { Comments } from '../entities/comment.entity';
import { CommentsService } from '../service/comments.service';

describe('CommentsService', () => {
  let service: CommentsService;
  let commentsRepository: Repository<Comments>;
  let userRepository: Repository<User>;
  let postRepository: Repository<Post>;

  const mockComment = {
    id: 'uuid-123',
    content: 'Test comment',
    createdAt: new Date(),
  } as Comments;

  const mockUser = {
    id: 'user-uuid',
    name: 'User Test',
  } as User;

  const mockPost = {
    id: 'post-uuid',
    title: 'Post Test',
  } as Post;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comments),
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Post),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    commentsRepository = module.get<Repository<Comments>>(getRepositoryToken(Comments));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('delete', () => {
    it('should return 404 if comment is not found', async () => {
      jest.spyOn(commentsRepository, 'findOne').mockResolvedValue(null);

      const result: ReturnMessageDTO = await service.delete('non-existent-id');

      expect(result).toEqual({
        statusCode: 404,
        message: systemMessage.ReturnMessage.errorCommentNotFound,
      });
      expect(commentsRepository.findOne).toHaveBeenCalledWith({ where: { id: 'non-existent-id' } });
      expect(commentsRepository.remove).not.toHaveBeenCalled();
    });

    it('should delete the comment and return 200 if found', async () => {
      jest.spyOn(commentsRepository, 'findOne').mockResolvedValue(mockComment);
      jest.spyOn(commentsRepository, 'remove').mockResolvedValue(mockComment);

      const result: ReturnMessageDTO = await service.delete('uuid-123');

      expect(commentsRepository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-123' } });
      expect(commentsRepository.remove).toHaveBeenCalledWith(mockComment);
      expect(result).toEqual({
        statusCode: 200,
        message: systemMessage.ReturnMessage.successDeleteComment,
      });
    });
  });

  describe('create', () => {
    const dto: CreateCommentDTO = {
      content: 'Novo comentário de teste',
      postId: 'post-uuid',
    };
    const userId = 'user-uuid';

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(dto, userId)).rejects.toThrow(
        new NotFoundException(systemMessage.ReturnMessage.errorUserNotFound),
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });

    it('should throw NotFoundException if post not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(dto, userId)).rejects.toThrow(
        new NotFoundException(systemMessage.ReturnMessage.errorPostNotFound),
      );

      expect(postRepository.findOne).toHaveBeenCalledWith({ where: { id: dto.postId } });
    });

    it('should create comment successfully', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost);
      jest.spyOn(commentsRepository, 'create').mockReturnValue(mockComment);
      jest.spyOn(commentsRepository, 'save').mockResolvedValue(mockComment);

      const result: ReturnMessageDTO = await service.create(dto, userId);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(postRepository.findOne).toHaveBeenCalledWith({ where: { id: dto.postId } });
      expect(commentsRepository.create).toHaveBeenCalledWith({
        content: dto.content,
        user: mockUser,
        post: mockPost,
      });
      expect(commentsRepository.save).toHaveBeenCalledWith(mockComment);
      expect(result).toEqual({
        statusCode: 200,
        message: systemMessage.ReturnMessage.successCreatedComment,
      });
    });
  });
});
