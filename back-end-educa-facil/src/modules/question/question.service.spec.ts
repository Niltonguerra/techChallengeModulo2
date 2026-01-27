import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { User } from '@modules/user/entities/user.entity';
import { SchoolSubject } from '@modules/school_subject/entities/school_subject.entity';
import { Repository } from 'typeorm';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';

describe('QuestionService', () => {
  let service: QuestionService;
  let questionRepository: Repository<Question>;
  let userRepository: Repository<User>;
  let schoolSubjectRepository: Repository<SchoolSubject>;

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
        {
          provide: getRepositoryToken(Question),
          useValue: mockQuestionRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(SchoolSubject),
          useValue: mockSchoolSubjectRepository,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    questionRepository = module.get(getRepositoryToken(Question));
    userRepository = module.get(getRepositoryToken(User));
    schoolSubjectRepository = module.get(getRepositoryToken(SchoolSubject));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateQuestionDto = {
      title: 'Test Question',
      description: 'Description',
      tags: ['subject-1'],
      author_id: 'user-1',
    };

    it('should create a question successfully', async () => {
      const user = { id: 'user-1' };
      const question = { id: 'q1' };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockSchoolSubjectRepository.findBy.mockResolvedValue([]);
      mockQuestionRepository.create.mockReturnValue(question);
      mockQuestionRepository.save.mockResolvedValue(question);

      const result = await service.create(dto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: dto.author_id },
      });

      expect(schoolSubjectRepository.findBy).toHaveBeenCalled();

      expect(questionRepository.create).toHaveBeenCalled();
      expect(questionRepository.save).toHaveBeenCalledWith(question);

      expect(result).toEqual({
        message: 'Pergunta criada com sucesso!',
        statusCode: 201,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);

      expect(questionRepository.create).not.toHaveBeenCalled();
      expect(questionRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return questions for student', async () => {
      const user = { id: 'u1', permission: 'student' };
      mockQueryBuilder.getMany.mockResolvedValue(['question']);

      const result = await service.findAll({ user });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(result).toEqual(['question']);
    });

    it('should filter by subject', async () => {
      const user = { id: 'u1', permission: 'teacher' };
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findAll({ user, subject: 'math' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'subjects.id = :subject',
        { subject: 'math' },
      );
    });

    it('should filter assignment MINE', async () => {
      const user = { id: 'u1', permission: 'teacher' };
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findAll({ user, assignment: 'MINE' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove question if user is owner', async () => {
      const question = {
        id: 'q1',
        users: [{ id: 'u1' }],
      };

      mockQuestionRepository.findOne.mockResolvedValue(question);

      const result = await service.remove({
        questionId: 'q1',
        user: { id: 'u1', permission: 'student' },
      });

      expect(questionRepository.remove).toHaveBeenCalledWith(question);
      expect(result).toEqual({ message: 'Dúvida removida com sucesso' });
    });

    it('should throw NotFoundException if question not found', async () => {
      mockQuestionRepository.findOne.mockResolvedValue(null);

      await expect(
        service.remove({
          questionId: 'q1',
          user: { id: 'u1', permission: 'student' },
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if student is not owner', async () => {
      const question = {
        id: 'q1',
        users: [{ id: 'another-user' }],
      };

      mockQuestionRepository.findOne.mockResolvedValue(question);

      await expect(
        service.remove({
          questionId: 'q1',
          user: { id: 'u1', permission: 'student' },
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
