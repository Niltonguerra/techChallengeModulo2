import { Test, TestingModule } from '@nestjs/testing';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtPayload } from '@modules/auth/dtos/JwtPayload.dto';
import { Conversation } from './entities/conversation.entity';
import { GetConversationDto } from './dto/get-conversations-response.dto';
import { QuestionViewService } from 'question_view/question_view.service';

describe('ConversationController', () => {
  let controller: ConversationController;
  let conversationService: jest.Mocked<ConversationService>;
  let questionViewService: jest.Mocked<QuestionViewService>;

  const conversationServiceMock: Partial<jest.Mocked<ConversationService>> = {
    listByQuestion: jest.fn(),
    sendMessage: jest.fn(),
  };

  const questionViewServiceMock: Partial<jest.Mocked<QuestionViewService>> = {
    markAsViewed: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationController],
      providers: [
        {
          provide: ConversationService,
          useValue: conversationServiceMock,
        },
        {
          provide: QuestionViewService,
          useValue: questionViewServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ConversationController>(ConversationController);
    conversationService = module.get(ConversationService);
    questionViewService = module.get(QuestionViewService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    it('should call markAsViewed and service.listByQuestion with correct args', async () => {
      const questionId = 'q1';
      const user = { id: 'u1' } as JwtPayload;

      const expected: GetConversationDto[] = [
        {
          id: 'c1',
          questionId: 'q1',
          userId: 'u1',
          message: 'x',
          authorName: 'A',
          isUserTheAuthor: true,
          createdAt: new Date().toISOString(),
        },
      ];

      conversationService.listByQuestion.mockResolvedValue(expected);

      const result = await controller.list(questionId, user);

      // Verifica chamada do QuestionViewService
      expect(questionViewService.markAsViewed).toHaveBeenCalledTimes(1);
      expect(questionViewService.markAsViewed).toHaveBeenCalledWith(questionId, user.id);

      // Verifica chamada do ConversationService
      expect(conversationService.listByQuestion).toHaveBeenCalledTimes(1);
      expect(conversationService.listByQuestion).toHaveBeenCalledWith(questionId, user.id);

      expect(result).toBe(expected);
    });
  });

  describe('send', () => {
    it('should call markAsViewed and service.sendMessage with correct args', async () => {
      const questionId = 'q1';
      const dto: CreateConversationDto = { message: 'hello' };
      const user = { id: 'u1' } as JwtPayload;

      const expected = { id: 'c1', message: 'hello' } as Conversation;

      conversationService.sendMessage.mockResolvedValue(expected);

      const result = await controller.send(questionId, dto, user);

      // Verifica chamada do QuestionViewService
      expect(questionViewService.markAsViewed).toHaveBeenCalledTimes(1);
      expect(questionViewService.markAsViewed).toHaveBeenCalledWith(questionId, user.id);

      // Verifica chamada do ConversationService
      expect(conversationService.sendMessage).toHaveBeenCalledTimes(1);
      expect(conversationService.sendMessage).toHaveBeenCalledWith(questionId, dto, user);

      expect(result).toBe(expected);
    });
  });
});
