import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConversationService } from './conversation.service';
import { Conversation } from './entities/conversation.entity';
import { Question } from './entities/question.entity';
import { ConversationGateway } from './conversation.gateway';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';
import { GetConversationDto } from './dto/get-conversations-response.dto';
import { User } from '@modules/user/entities/user.entity';
import { QuestionViewService } from 'question_view/question_view.service';
import { NotificationGateway } from './notification.gateway';

describe('ConversationService', () => {
  let service: ConversationService;
  let conversationRepo: jest.Mocked<Repository<Conversation>>;
  let questionRepo: jest.Mocked<Repository<Question>>;
  let gateway: jest.Mocked<ConversationGateway>;
  let notificationGateway: { notifyUser: jest.Mock };
  let questionViewService: { getLastSeen: jest.Mock };

  const qbMock = {
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    setParameter: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        {
          provide: getRepositoryToken(Conversation),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(() => qbMock),
          },
        },
        {
          provide: getRepositoryToken(Question),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: ConversationGateway,
          useValue: {
            notifyNewMessages: jest.fn(),
            isUserViewing: jest.fn().mockResolvedValue(false),
          },
        },
        {
          provide: NotificationGateway,
          useValue: { notifyUser: jest.fn() },
        },
        {
          provide: QuestionViewService,
          useValue: { getLastSeen: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(ConversationService);
    conversationRepo = module.get(getRepositoryToken(Conversation));
    questionRepo = module.get(getRepositoryToken(Question));
    gateway = module.get(ConversationGateway);
    notificationGateway = module.get(NotificationGateway);
    questionViewService = module.get(QuestionViewService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listByQuestion', () => {
    it('should throw NotFoundException if question not found', async () => {
      questionRepo.findOne.mockResolvedValue(null);

      await expect(service.listByQuestion('q1', 'u1')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should return conversations', async () => {
      questionRepo.findOne.mockResolvedValue(new Question());

      const mockData: GetConversationDto[] = [
        {
          id: 'c1',
          questionId: 'q1',
          userId: 'u1',
          message: 'hi',
          authorName: 'Nilton',
          isUserTheAuthor: true,
          createdAt: '2026-01-01T10:00:00.000Z',
        },
      ];

      qbMock.getRawMany.mockResolvedValue(mockData);

      const result = await service.listByQuestion('q1', 'u1');

      expect(conversationRepo.createQueryBuilder).toHaveBeenCalledWith('c');
      expect(qbMock.leftJoin).toHaveBeenCalled();
      expect(qbMock.where).toHaveBeenCalled();
      expect(qbMock.orderBy).toHaveBeenCalled();
      expect(qbMock.getRawMany).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('sendMessage', () => {
    it('should throw NotFoundException if question not found', async () => {
      questionRepo.findOne.mockResolvedValue(null);

      await expect(
        service.sendMessage('q1', { message: 'hi' }, { id: 'u1' } as JwtPayload),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw ForbiddenException if user is not participant/admin', async () => {
      const question = new Question();
      question.users = [{ id: 'u2' } as User];
      question.admin = { id: 'u3' } as User;

      questionRepo.findOne.mockResolvedValue(question);

      await expect(
        service.sendMessage('q1', { message: 'hi' }, { id: 'u1' } as JwtPayload),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should save message and notify gateway and users', async () => {
      const question = new Question();
      question.id = 'q1';
      question.title = 'Mock Question';
      question.users = [{ id: 'u1' } as User];
      question.admin = { id: 'u2' } as User;

      questionRepo.findOne.mockResolvedValue(question);

      const dto: CreateConversationDto = { message: 'hello' };
      const user: JwtPayload = {
        id: 'u1',
        email: 'user@example.com',
        permission: 'user',
        iat: 2313334,
        exp: 132133,
      };
      const entity = new Conversation();
      entity.id_user = 'u1';
      entity.message = dto.message;
      entity.question = question;
      entity.created_at = new Date();

      conversationRepo.create.mockReturnValue(entity);
      conversationRepo.save.mockResolvedValue(entity);

      questionViewService.getLastSeen.mockResolvedValue(null);
      (gateway.isUserViewing as jest.Mock).mockResolvedValue(false);

      const result = await service.sendMessage('q1', dto, user);

      expect(conversationRepo.create).toHaveBeenCalledWith({
        id_user: user.id,
        message: dto.message,
        question,
        created_at: expect.any(String) as unknown as string,
      });
      expect(conversationRepo.save).toHaveBeenCalledWith(entity);
      expect(gateway.notifyNewMessages).toHaveBeenCalledWith('q1', {
        id: entity.id,
        message: entity.message,
        createdAt: entity.created_at,
        userId: entity.id_user,
      });
      expect(notificationGateway.notifyUser).toHaveBeenCalled();
      expect(result).toBe(entity);
    });
  });
});
