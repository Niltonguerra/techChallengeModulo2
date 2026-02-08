import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { Question } from './entities/question.entity';
import { QuestionStatus } from './enum/question-status.enum';
import { User } from '@modules/user/entities/user.entity';
import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';
import { UserStatusEnum } from '@modules/user/enum/status.enum';

describe('QuestionController', () => {
  let controller: QuestionController;
  let service: jest.Mocked<QuestionService>;

  const mockUser: JwtPayload = {
    id: 'u1',
    email: 'test@test.com',
    permission: 'user',
    iat: 0,
    exp: 0,
  };
  const mockAdmin: User = {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'hashedPassword',
    photo: '',
    permission: UserPermissionEnum.ADMIN,
    is_active: UserStatusEnum.ACTIVE,
    posts: [],
    comments: [],
    school_subjects: [],
    questions: [] as Question[],
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        {
          provide: QuestionService,
          useValue: {
            create: jest.fn(),
            assignToAdmin: jest.fn(),
            closeQuestion: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<QuestionController>(QuestionController);
    service = module.get(QuestionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with the DTO and user id', async () => {
      const dto: CreateQuestionDto = {
        title: 'Test',
        description: 'Desc',
        author_id: '',
        tags: ['tag1', 'tag2'],
      };
      const returnValue: ReturnMessageDTO = {
        message: 'Question created',
        statusCode: 201, // ou 200, dependendo do seu caso
      };
      service.create.mockResolvedValue(returnValue);

      const result = await controller.create(dto, mockUser);

      expect(dto.author_id).toBe(mockUser.id);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(returnValue);
    });
  });

  describe('assignAdmin', () => {
    it('should call service.assignToAdmin with id and user id', async () => {
      const returnValue: ReturnMessageDTO = {
        message: 'Question created',
        statusCode: 201,
      };
      service.assignToAdmin.mockResolvedValue(returnValue);

      const result = await controller.assignAdmin('q1', mockUser);

      expect(service.assignToAdmin).toHaveBeenCalledWith('q1', mockUser.id);
      expect(result).toBe(returnValue);
    });
  });

  describe('closeQuestion', () => {
    it('should call service.closeQuestion with id and user', async () => {
      const returnValue: ReturnMessageDTO = {
        message: 'Question created',
        statusCode: 201,
      };
      service.closeQuestion.mockResolvedValue(returnValue);

      const result = await controller.closeQuestion('q1', mockUser);

      expect(service.closeQuestion).toHaveBeenCalledWith('q1', mockUser);
      expect(result).toBe(returnValue);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with filters', async () => {
      const returnValue: Question[] = [
        {
          id: 'q1',
          title: 'Mock question',
          description: 'Test description',
          status: QuestionStatus.OPEN,
          admin: mockAdmin,
          users: [],
          school_subjects: [],
          conversations: [],
          created_at: new Date(),
        },
      ];

      const req: any = { user: mockUser };
      service.findAll.mockResolvedValue(returnValue);

      const result = await controller.findAll(req, 'Math', 'MINE');

      expect(service.findAll).toHaveBeenCalledWith({
        user: mockUser,
        subject: 'Math',
        assignment: 'MINE',
      });
      expect(result).toBe(returnValue);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      const returnValue: Question = {
        id: 'q1',
        title: 'Mock question',
        description: 'Test description',
        status: QuestionStatus.OPEN,
        admin: mockAdmin,
        users: [],
        school_subjects: [],
        conversations: [],
        created_at: new Date(),
      };
      service.findOne.mockResolvedValue(returnValue);

      const result = await controller.findOne('q1');

      expect(service.findOne).toHaveBeenCalledWith('q1');
      expect(result).toBe(returnValue);
    });
  });

  it('should call service.update with id and DTO', () => {
    const dto: UpdateQuestionDto = { title: 'Updated', description: 'New' };
    const returnValue: ReturnMessageDTO = { message: 'ok', statusCode: 200 };

    service.update = jest.fn().mockReturnValue(returnValue);

    const result = controller.update('1', dto);

    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toBe(returnValue);
  });

  describe('remove', () => {
    it('should call service.remove with questionId and user', async () => {
      const returnValue: ReturnMessageDTO = {
        message: 'ok',
        statusCode: 200,
      };
      const req: any = { user: mockUser };
      service.remove.mockResolvedValue(returnValue);

      const result = await controller.remove('q1', req);

      expect(service.remove).toHaveBeenCalledWith({ questionId: 'q1', user: mockUser });
      expect(result).toBe(returnValue);
    });
  });
});
