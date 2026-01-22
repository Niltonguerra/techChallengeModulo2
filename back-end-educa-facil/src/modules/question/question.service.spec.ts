import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { User } from '@modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';

describe('QuestionService', () => {
  let service: QuestionService;
  let questionRepository: Repository<Question>;
  let userRepository: Repository<User>;

  const mockQuestionRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
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
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    questionRepository = module.get<Repository<Question>>(getRepositoryToken(Question));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createQuestionDto: CreateQuestionDto = {
      title: 'Test Question',
      description: 'Test Description',
      tags: ['ridfeh347983'],
      author_id: 'user-id',
    };

    it('should successfully create a question', async () => {
      const mockUser = { id: 'user-id', name: 'User' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const mockQuestion = {
        title: createQuestionDto.title,
        description: createQuestionDto.description,
        id_school_subject: createQuestionDto.tags,
        created_at: new Date().toISOString(),
        users: [mockUser],
      };

      mockQuestionRepository.create.mockReturnValue(mockQuestion);
      mockQuestionRepository.save.mockResolvedValue(mockQuestion);

      const result = await service.create(createQuestionDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: createQuestionDto.author_id },
      });
      expect(questionRepository.create).toHaveBeenCalled();
      expect(questionRepository.save).toHaveBeenCalledWith(mockQuestion);
      expect(result).toEqual({
        message: 'Pergunta criada com sucesso!',
        statusCode: 201,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createQuestionDto)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: createQuestionDto.author_id },
      });
      expect(questionRepository.create).not.toHaveBeenCalled();
      expect(questionRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('placeholders', () => {
    it('findAll should return string', () => {
      expect(service.findAll()).toBe('This action returns all question');
    });

    it('findOne should return string', () => {
      expect(service.findOne(1)).toBe('This action returns a #1 question');
    });

    it('update should return string', () => {
      expect(service.update(1, {} as any)).toBe('This action updates a #1 question');
    });

    it('remove should return string', () => {
      expect(service.remove(1)).toBe('This action removes a #1 question');
    });
  });
});
