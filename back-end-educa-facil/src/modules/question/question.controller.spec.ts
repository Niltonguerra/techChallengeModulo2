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
    it('should call service.findAll', () => {
      mockQuestionService.findAll.mockReturnValue('all');
      expect(controller.findAll()).toBe('all');
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct id', () => {
      mockQuestionService.findOne.mockReturnValue('one');
      expect(controller.findOne('1')).toBe('one');
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call service.update with correct params', () => {
      mockQuestionService.update.mockReturnValue('updated');
      const dto = { title: 'new' };
      expect(controller.update('1', dto as any)).toBe('updated');
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', () => {
      mockQuestionService.remove.mockReturnValue('removed');
      expect(controller.remove('1')).toBe('removed');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
