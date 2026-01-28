import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';
import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';

describe('QuestionController', () => {
  let controller: QuestionController;
  let service: QuestionService;

  const mockQuestionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    assignToAdmin: jest.fn(),
    closeQuestion: jest.fn(),
  };

  const mockReq = {
    user: {
      id: 'user-123',
      permission: 'student',
    },
  };

  const mockUser: JwtPayload = {
    id: 'user-123',
    permission: UserPermissionEnum.USER,
  } as JwtPayload;

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
      const dto = {
        title: 'Test',
        description: 'Desc',
        tags: ['dsdsd123'],
      } as CreateQuestionDto;

      const mockUser = { id: 'user-uuid' } as JwtPayload;

      const expectedResult = { statusCode: 201, message: 'Created' };
      mockQuestionService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto, mockUser);

      expect(service.create).toHaveBeenCalledWith({
        ...dto,
        author_id: mockUser.id,
      });

      expect(result).toEqual(expectedResult);
    });
  });

  describe('assignAdmin', () => {
    it('should call service.assignToAdmin with correct params', () => {
      mockQuestionService.assignToAdmin.mockReturnValue('assigned');

      const result = controller.assignAdmin('q1', mockUser);

      expect(service.assignToAdmin).toHaveBeenCalledWith('q1', mockUser.id);

      expect(result).toBe('assigned');
    });
  });

  describe('closeQuestion', () => {
    it('should call service.closeQuestion with correct params', () => {
      mockQuestionService.closeQuestion.mockReturnValue('closed');

      const result = controller.closeQuestion('q1', mockUser);

      expect(service.closeQuestion).toHaveBeenCalledWith('q1', mockUser);
      expect(result).toBe('closed');
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with filters', () => {
      mockQuestionService.findAll.mockReturnValue('all');

      const result = controller.findAll(mockReq as any, 'math', 'MINE');

      expect(service.findAll).toHaveBeenCalledWith({
        user: mockReq.user,
        subject: 'math',
        assignment: 'MINE',
      });

      expect(result).toBe('all');
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with string id', () => {
      mockQuestionService.findOne.mockReturnValue('one');

      const result = controller.findOne('uuid-1');

      expect(service.findOne).toHaveBeenCalledWith('uuid-1');
      expect(result).toBe('one');
    });
  });

  describe('update', () => {
    it('should call service.update with correct params', () => {
      const dto = { title: 'new title' };
      mockQuestionService.update.mockReturnValue('updated');

      const result = controller.update('1', dto as any);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toBe('updated');
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct params', async () => {
      mockQuestionService.remove.mockResolvedValue('removed');

      const result = await controller.remove('q1', mockReq as any);

      expect(service.remove).toHaveBeenCalledWith({
        questionId: 'q1',
        user: mockReq.user,
      });

      expect(result).toBe('removed');
    });
  });
});
