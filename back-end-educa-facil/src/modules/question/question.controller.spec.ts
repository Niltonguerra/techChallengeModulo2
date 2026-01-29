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
import { User } from '@modules/user/entities/user.entity';
import { GetConversationDto } from './dto/get-conversations-response.dto';
type QBMock<T> = {
  leftJoin: jest.MockedFunction<any>;
  where: jest.MockedFunction<any>;
  orderBy: jest.MockedFunction<any>;
  select: jest.MockedFunction<any>;
  setParameter: jest.MockedFunction<any>;
  getRawMany: jest.Mock<Promise<T[]>>;
};

describe('ConversationService', () => {
  let service: ConversationService;
  let conversationRepo: jest.Mocked<Repository<Conversation>>;
  let questionRepo: jest.Mocked<Repository<Question>>;
  let gateway: { notifyNewMessages: jest.Mock };
  let qbMock: QBMock<GetConversationDto>;

  beforeEach(async () => {
    qbMock = {
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      setParameter: jest.fn().mockReturnThis(),
      getRawMany: jest.fn<Promise<GetConversationDto[]>, []>(),
    };

    const conversationRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(() => qbMock),
    };

    const questionRepoMock = {
      findOne: jest.fn(),
    };

    const gatewayMock = {
      notifyNewMessages: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        { provide: getRepositoryToken(Conversation), useValue: conversationRepoMock },
        { provide: getRepositoryToken(Question), useValue: questionRepoMock },
        { provide: ConversationGateway, useValue: gatewayMock },
      ],
    }).compile();

    service = module.get(ConversationService);
    conversationRepo = module.get(getRepositoryToken(Conversation));
    questionRepo = module.get(getRepositoryToken(Question));
    gateway = module.get(ConversationGateway);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listByQuestion', () => {
    it('should throw NotFoundException if question does not exist', async () => {
      questionRepo.findOne.mockResolvedValue(null);

      await expect(service.listByQuestion('q1', 'u1')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should return conversations ordered by created_at ASC', async () => {
      questionRepo.findOne.mockResolvedValue({ id: 'q1' } as Question);

      const expected = [
        {
          content: 'hi',
          authorName: 'Nilton',
          isUserTheAuthor: true,
          createdAt: '2026-01-01T10:00:00.000Z',
        },
        {
          content: 'hello',
          authorName: 'Maria',
          isUserTheAuthor: false,
          createdAt: '2026-01-01T10:01:00.000Z',
        },
      ];

      qbMock.getRawMany.mockResolvedValue(expected as unknown as GetConversationDto[]);

      const result = await service.listByQuestion('q1', 'u1');

      expect(conversationRepo.createQueryBuilder).toHaveBeenCalledWith('c');

      expect(qbMock.leftJoin).toHaveBeenCalledTimes(2);
      expect(qbMock.leftJoin).toHaveBeenNthCalledWith(1, 'c.question', 'q');
      expect(qbMock.leftJoin).toHaveBeenNthCalledWith(2, User, 'u', 'u.id = c.id_user::uuid');

      expect(qbMock.where).toHaveBeenCalledWith('q.id = :questionId::uuid', { questionId: 'q1' });

      expect(qbMock.orderBy).toHaveBeenCalledWith('c.created_at', 'ASC');

      expect(qbMock.select).toHaveBeenCalledWith([
        'c.message AS "content"',
        'u.name AS "authorName"',
        '(c.id_user = :requesterId) AS "isUserTheAuthor"',
        'c.created_at AS "createdAt"',
      ]);

      expect(qbMock.setParameter).toHaveBeenCalledWith('requesterId', 'u1');

      expect(qbMock.getRawMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });
  });

  describe('sendMessage', () => {
    it('should throw NotFoundException if question does not exist', async () => {
      questionRepo.findOne.mockResolvedValue(null);

      await expect(
        service.sendMessage('q1', { message: 'hi' }, { id: 'u1' } as JwtPayload),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw ForbiddenException if user is not participant nor assigned admin', async () => {
      questionRepo.findOne.mockResolvedValue({
        id: 'q1',
        users: [{ id: 'u2' }],
        admin: { id: 'u3' },
      } as Question);

      await expect(
        service.sendMessage('q1', { message: 'hi' }, { id: 'u1' } as JwtPayload),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should save message and notify gateway when user is a participant', async () => {
      const question = {
        id: 'q1',
        users: [{ id: 'u1' }],
        admin: { id: 'u9' },
      } as Question;

      questionRepo.findOne.mockResolvedValue(question);

      const dto: CreateConversationDto = { message: 'hello' };
      const user = { id: 'u1' } as JwtPayload;

      const createdEntity = {
        id_user: 'u1',
        message: 'hello',
        question,
      } as Conversation;

      conversationRepo.create.mockReturnValue(createdEntity);
      conversationRepo.save.mockResolvedValue(createdEntity);

      const result = await service.sendMessage('q1', dto, user);

      expect(conversationRepo.create).toHaveBeenCalledTimes(1);
      expect(conversationRepo.save).toHaveBeenCalledTimes(1);
      expect(gateway.notifyNewMessages).toHaveBeenCalledWith('q1');
      expect(result).toBe(createdEntity);
    });

    it('should save message and notify gateway when user is the assigned admin', async () => {
      const question = {
        id: 'q1',
        users: [{ id: 'u8' }],
        admin: { id: 'u1' },
      } as Question;

      questionRepo.findOne.mockResolvedValue(question);

      const dto: CreateConversationDto = { message: 'admin message' };
      const user = { id: 'u1' } as JwtPayload;

      const createdEntity = {
        id_user: 'u1',
        message: dto.message,
        question,
      } as Conversation;

      conversationRepo.create.mockReturnValue(createdEntity);
      conversationRepo.save.mockResolvedValue(createdEntity);

      const result = await service.sendMessage('q1', dto, user);

      expect(gateway.notifyNewMessages).toHaveBeenCalledWith('q1');
      expect(result).toBe(createdEntity);
    });
  });
});
