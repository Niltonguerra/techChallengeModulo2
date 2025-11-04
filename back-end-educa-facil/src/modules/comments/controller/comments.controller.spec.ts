import { systemMessage } from '@config/i18n/pt/systemMessage';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardStudent } from '@modules/auth/guards/roles-student.guard';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from '../controller/comments.controller';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { PaginateDTO } from '../dto/get-comment.dto';
import { ListCommentDTO } from '../dto/return-comment.dto';
import { CommentsService } from '../service/comments.service';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            delete: jest.fn(),
            create: jest.fn(),
            findByPostId: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuardUser)
      .useValue(mockGuard)
      .overrideGuard(RolesGuardStudent)
      .useValue(mockGuard)
      .compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('remove', () => {
    it('should call CommentsService.delete and return its result (success)', async () => {
      const mockResult: ReturnMessageDTO = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.successDeleteComment,
      };

      jest.spyOn(service, 'delete').mockResolvedValue(mockResult);

      const result = await controller.remove('uuid-123');

      expect(service.delete).toHaveBeenCalledWith('uuid-123');
      expect(result).toEqual(mockResult);
    });

    it('should return 404 message if comment not found', async () => {
      const mockResult: ReturnMessageDTO = {
        statusCode: 404,
        message: systemMessage.ReturnMessage.errorCommentNotFound,
      };

      jest.spyOn(service, 'delete').mockResolvedValue(mockResult);

      const result = await controller.remove('non-existent-id');

      expect(service.delete).toHaveBeenCalledWith('non-existent-id');
      expect(result).toEqual(mockResult);
    });
  });

  describe('create', () => {
    it('should call CommentsService.create and return its result', async () => {
      const dto: CreateCommentDTO = {
        content: 'Excelente post!',
        postId: 'post-uuid-123',
      };

      const token: JwtPayload = {
        id: 'user-uuid-456',
        email: 'user@email.com',
        permission: 'student',
      };

      const mockResult = {
        statusCode: 200,
        message: systemMessage.ReturnMessage.successCreatedComment,
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockResult);

      const result = await controller.create(dto, token);

      expect(service.create).toHaveBeenCalledWith(dto, token.id);
      expect(result).toEqual(mockResult);
    });

    it('should handle error when CommentsService.create throws', async () => {
      const dto: CreateCommentDTO = {
        content: 'Comentário inválido',
        postId: 'invalid-post',
      };

      const token: JwtPayload = { id: 'user-uuid', email: '', permission: 'student' };

      jest.spyOn(service, 'create').mockRejectedValue(new Error('Post não encontrado'));

      await expect(controller.create(dto, token)).rejects.toThrow('Post não encontrado');
      expect(service.create).toHaveBeenCalledWith(dto, token.id);
    });
  });

  describe('getCommentsByPost', () => {
    it('should call CommentsService.findByPostId and return formatted comments', async () => {
      const mockComments: ListCommentDTO[] = [
        {
          id: 'comment-1',
          content: 'Ótimo post!',
          createdAt: new Date('2025-11-03T12:00:00Z'),
          user: { name: 'João Silva', photo: 'joao.jpg' },
        },
        {
          id: 'comment-2',
          content: 'Muito informativo!',
          createdAt: new Date('2025-11-03T12:05:00Z'),
          user: { name: 'Maria Souza', photo: 'maria.jpg' },
        },
      ];

      const query: PaginateDTO = { offset: '0', limit: '10' };

      jest.spyOn(service, 'findByPostId').mockResolvedValue(mockComments);

      const result = await controller.getCommentsByPost('post-uuid-123', query);

      expect(service.findByPostId).toHaveBeenCalledWith('post-uuid-123', query);
      expect(result).toEqual(mockComments);
    });

    it('should handle error when post is not found', async () => {
      const query: PaginateDTO = { offset: '0', limit: '10' };

      jest.spyOn(service, 'findByPostId').mockRejectedValue(new Error('Post não encontrado'));

      await expect(controller.getCommentsByPost('invalid-post-id', query)).rejects.toThrow(
        'Post não encontrado',
      );
      expect(service.findByPostId).toHaveBeenCalledWith('invalid-post-id', query);
    });
  });
});
