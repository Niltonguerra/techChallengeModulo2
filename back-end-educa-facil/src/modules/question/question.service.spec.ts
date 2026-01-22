import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { User } from '@modules/user/entities/user.entity';
import { SchoolSubject } from '@modules/school_subject/entities/school_subject.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';

describe('QuestionService', () => {
  let service: QuestionService;
  let questionRepository: Repository<Question>;
  let userRepository: Repository<User>;
  let schoolSubjectRepository: Repository<SchoolSubject>;

  const mockQuestionRepository = {
    create: jest.fn(),
    save: jest.fn(),
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
    questionRepository = module.get<Repository<Question>>(getRepositoryToken(Question));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    schoolSubjectRepository = module.get<Repository<SchoolSubject>>(
      getRepositoryToken(SchoolSubject),
    );
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
      tags: ['550e8400-e29b-41d4-a716-446655440000'],
      author_id: '550e8400-e29b-41d4-a716-446655440001',
    };

    it('should successfully create a question', async () => {
      const mockUser = { id: createQuestionDto.author_id };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockSchoolSubjectRepository.findBy.mockResolvedValue([]);

      const mockQuestion = {
        title: createQuestionDto.title,
        description: createQuestionDto.description,
        school_subjects: [],
        users: [mockUser],
        created_at: new Date().toISOString(),
      };

      mockQuestionRepository.create.mockReturnValue(mockQuestion);
      mockQuestionRepository.save.mockResolvedValue(mockQuestion);

      const result = await service.create(createQuestionDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: createQuestionDto.author_id },
      });

      expect(schoolSubjectRepository.findBy).toHaveBeenCalled();

      expect(questionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: createQuestionDto.title,
          description: createQuestionDto.description,
          users: [mockUser],
        }),
      );

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

      expect(schoolSubjectRepository.findBy).not.toHaveBeenCalled();
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
