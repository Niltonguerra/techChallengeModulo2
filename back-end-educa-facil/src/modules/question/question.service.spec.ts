import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { User } from '@modules/user/entities/user.entity';
import { SchoolSubject } from '@modules/school_subject/entities/school_subject.entity';
import { ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionStatus } from './enum/question-status.enum';
import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';

describe('QuestionService', () => {
  let service: QuestionService;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockQuestionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockSchoolSubjectRepository = {
    findBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        { provide: getRepositoryToken(Question), useValue: mockQuestionRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(SchoolSubject), useValue: mockSchoolSubjectRepository },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto: CreateQuestionDto = {
      title: 'Pergunta',
      description: 'Descrição',
      tags: ['sub-1'],
      author_id: 'user-1',
    };

    it('should create question successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 'user-1' });
      mockSchoolSubjectRepository.findBy.mockResolvedValue([]);
      mockQuestionRepository.create.mockReturnValue({});
      mockQuestionRepository.save.mockResolvedValue({});

      const result = await service.create(dto);

      expect(result).toEqual({
        message: 'Pergunta criada com sucesso!',
        statusCode: 201,
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return questions for student', async () => {
      mockQueryBuilder.getMany.mockResolvedValue(['q1']);

      const result = await service.findAll({
        user: {
          id: 'u1',
          email: 'u1@test.com',
          permission: 'USER',
        },
      });

      expect(result).toEqual(['q1']);
    });
  });

  describe('assignToAdmin', () => {
    it('should assign question to admin', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        id: 'a1',
        permission: UserPermissionEnum.ADMIN,
      });

      mockQuestionRepository.findOne.mockResolvedValue({
        status: QuestionStatus.OPEN,
        admin: null,
        users: [],
      });

      mockQuestionRepository.save.mockResolvedValue({});

      const result = await service.assignToAdmin('q1', 'a1');

      expect(result.message).toContain('atribuída');
    });

    it('should throw ForbiddenException if user is not admin', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        id: 'u1',
        permission: UserPermissionEnum.USER,
      });

      await expect(service.assignToAdmin('q1', 'u1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if question is closed', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        id: 'a1',
        permission: UserPermissionEnum.ADMIN,
      });

      mockQuestionRepository.findOne.mockResolvedValue({
        status: QuestionStatus.CLOSED,
        admin: null,
        users: [],
      });

      await expect(service.assignToAdmin('q1', 'a1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('closeQuestion', () => {
    it('should close question by admin', async () => {
      mockQuestionRepository.findOne.mockResolvedValue({
        status: QuestionStatus.OPEN,
        users: [],
        admin: null,
      });

      mockQuestionRepository.save.mockResolvedValue({});

      const result = await service.closeQuestion('q1', {
        id: 'a1',
        email: 'admin@test.com',
        permission: 'ADMIN',
      });

      expect(result.message).toContain('finalizada');
    });

    it('should throw ForbiddenException if user is not author nor admin', async () => {
      mockQuestionRepository.findOne.mockResolvedValue({
        status: QuestionStatus.OPEN,
        users: [{ id: 'u2' }],
        admin: null,
      });

      await expect(
        service.closeQuestion('q1', {
          id: 'u1',
          email: 'user@test.com',
          permission: 'USER',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findOne', () => {
    it('should return question', async () => {
      mockQuestionRepository.findOne.mockResolvedValue({ id: 'q1' });

      const result = await service.findOne('q1');

      expect(result.id).toBe('q1');
    });

    it('should throw NotFoundException if question does not exist', async () => {
      mockQuestionRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('q99')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove question if owner', async () => {
      mockQuestionRepository.findOne.mockResolvedValue({
        users: [{ id: 'u1' }],
      });

      mockQuestionRepository.remove.mockResolvedValue({});

      const result = await service.remove({
        questionId: 'q1',
        user: {
          id: 'u1',
          email: 'u1@test.com',
          permission: 'USER',
        },
      });

      expect(result.message).toContain('removida');
    });

    it('should throw ForbiddenException if student is not owner', async () => {
      mockQuestionRepository.findOne.mockResolvedValue({
        users: [{ id: 'u2' }],
      });

      await expect(
        service.remove({
          questionId: 'q1',
          user: {
            id: 'u1',
            email: 'u1@test.com',
            permission: 'USER',
          },
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
