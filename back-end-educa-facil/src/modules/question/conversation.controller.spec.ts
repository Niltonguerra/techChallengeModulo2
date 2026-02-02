import { Test, TestingModule } from '@nestjs/testing';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';
import { Conversation } from './entities/conversation.entity';
import { GetConversationDto } from './dto/get-conversations-response.dto';

describe('ConversationController', () => {
  let controller: ConversationController;
  let service: jest.Mocked<ConversationService>;

  const serviceMock: Partial<jest.Mocked<ConversationService>> = {
    listByQuestion: jest.fn(),
    sendMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationController],
      providers: [
        {
          provide: ConversationService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<ConversationController>(ConversationController);
    service = module.get(ConversationService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    it('should call service.listByQuestion with questionId and requesterId', async () => {
      const questionId = 'q1';
      const user = { id: 'u1' } as JwtPayload;

      const expected = [
        {
          message: 'x',
          authorName: 'A',
          isUserTheAuthor: true,
          createdAt: new Date().toISOString(),
        },
      ] as GetConversationDto[];

      service.listByQuestion.mockResolvedValue(expected);

      const result = await controller.list(questionId, user);

      expect(service.listByQuestion).toHaveBeenCalledTimes(1);
      expect(service.listByQuestion).toHaveBeenCalledWith(questionId, user.id);
      expect(result).toBe(expected);
    });
  });

  describe('send', () => {
    it('should call service.sendMessage with questionId, dto and user', async () => {
      const questionId = 'q1';
      const dto: CreateConversationDto = { message: 'hello' };
      const user = { id: 'u1' } as JwtPayload;

      const expected = { id: 'c1', message: 'hello' } as Conversation;
      service.sendMessage.mockResolvedValue(expected);

      const result = await controller.send(questionId, dto, user);

      expect(service.sendMessage).toHaveBeenCalledTimes(1);
      expect(service.sendMessage).toHaveBeenCalledWith(questionId, dto, user);
      expect(result).toBe(expected);
    });
  });
});
