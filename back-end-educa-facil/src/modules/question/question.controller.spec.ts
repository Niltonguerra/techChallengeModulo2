import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';

describe('QuestionController', () => {
  let controller: QuestionController;
  let service: QuestionService;

  const mockQuestionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockReq = {
    user: {
      id: 'user-123',
      email: 'test@test.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        {
          provide: QuestionService,
          useValue: mockQuestionService,
        },
      ],
    }).compile();

    controller = module.get<QuestionController>(QuestionController);
    service = module.get<QuestionService>(QuestionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct params', async () => {
      const dto: CreateQuestionDto = {
        title: 'Test',
        description: 'Desc',
        tags: ['dsdsd123'],
        author_id: '123',
      };

      const expectedResult = { statusCode: 201, message: 'Created' };
      mockQuestionService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with filters', () => {
      mockQuestionService.findAll.mockReturnValue('all');

      const result = controller.findAll(
        mockReq,
        'math',
        'MINE',
      );

      expect(service.findAll).toHaveBeenCalledWith({
        user: mockReq.user,
        subject: 'math',
        assignment: 'MINE',
      });

      expect(result).toBe('all');
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct id', () => {
      mockQuestionService.findOne.mockReturnValue('one');

      const result = controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toBe('one');
    });
  });

  describe('update', () => {
    it('should call service.update with correct params', () => {
      const dto = { title: 'new' };
      mockQuestionService.update.mockReturnValue('updated');

      const result = controller.update('1', dto as any);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toBe('updated');
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct params', async () => {
      mockQuestionService.remove.mockResolvedValue('removed');

      const result = await controller.remove('1', mockReq);

      expect(service.remove).toHaveBeenCalledWith({
        questionId: '1',
        user: mockReq.user,
      });

      expect(result).toBe('removed');
    });
  });
});
