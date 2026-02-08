import { Test, TestingModule } from '@nestjs/testing';
import { QuestionViewService } from './question_view.service';
import { QuestionView } from './entities/question_view.entity';
import { Conversation } from '@modules/question/entities/conversation.entity';
import { User } from '@modules/user/entities/user.entity';
import { Question } from '@modules/question/entities/question.entity';

// Tipagem limpa para mocks de repositórios
type MockRepository<T> = {
  findOne: jest.Mock<Promise<T | undefined>, [any]>;
  upsert: jest.Mock<Promise<void>, [Partial<T>, { conflictPaths: string[] }]>;
  createQueryBuilder: jest.Mock<any, any>;
};

// Helper para criar mock de repositório
const createMockRepository = <T>(): MockRepository<T> => ({
  findOne: jest.fn<Promise<T | undefined>, [any]>(),
  upsert: jest.fn<Promise<void>, [Partial<T>, { conflictPaths: string[] }]>(),
  createQueryBuilder: jest.fn(
    (): QueryBuilderMock => ({
      innerJoin: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      distinctOn: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    }),
  ),
});

type QueryBuilderMock = {
  innerJoin: jest.MockedFunction<() => QueryBuilderMock>;
  leftJoin: jest.MockedFunction<() => QueryBuilderMock>;
  where: jest.MockedFunction<() => QueryBuilderMock>;
  andWhere: jest.MockedFunction<() => QueryBuilderMock>;
  distinctOn: jest.MockedFunction<() => QueryBuilderMock>;
  select: jest.MockedFunction<() => QueryBuilderMock>;
  orderBy: jest.MockedFunction<() => QueryBuilderMock>;
  addOrderBy: jest.MockedFunction<() => QueryBuilderMock>;
  getRawMany: jest.MockedFunction<() => Promise<any[]>>;
};

describe('QuestionViewService', () => {
  let service: QuestionViewService;
  let questionViewRepo: MockRepository<QuestionView>;
  let conversationRepo: MockRepository<Conversation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionViewService,
        { provide: 'QuestionRepository', useValue: createMockRepository<QuestionView>() },
        { provide: 'UserRepository', useValue: createMockRepository<QuestionView>() },
        { provide: 'QuestionViewRepository', useValue: createMockRepository<QuestionView>() },
        { provide: 'ConversationRepository', useValue: createMockRepository<Conversation>() },
      ],
    }).compile();

    service = module.get<QuestionViewService>(QuestionViewService);
    questionViewRepo = module.get<MockRepository<QuestionView>>('QuestionViewRepository');
    conversationRepo = module.get<MockRepository<Conversation>>('ConversationRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('markAsViewed', () => {
    it('should call upsert with correct data', async () => {
      const questionId = 'q1';
      const userId = 'u1';

      questionViewRepo.upsert.mockResolvedValue(undefined);

      await service.markAsViewed(questionId, userId);

      const [calledArg, optionsArg] = questionViewRepo.upsert.mock.calls[0];

      const typedArg = calledArg as {
        user: { id: string };
        question: { id: string };
        last_seen_at: Date;
      };
      const typedOptions = optionsArg as { conflictPaths: string[] };

      expect(typedArg.user).toEqual({ id: userId });
      expect(typedArg.question).toEqual({ id: questionId });
      expect(typedArg.last_seen_at).toBeInstanceOf(Date);
      expect(typedOptions).toEqual({ conflictPaths: ['user', 'question'] });
    });
  });

  describe('getLastSeen', () => {
    it('should call findOne with correct where', async () => {
      const questionId = 'q1';
      const userId = 'u1';

      // Mock mínimo e completo para o TS
      const mockUser = new User();
      mockUser.id = userId;
      mockUser.name = 'Mock User';
      mockUser.email = 'mock@example.com';

      const mockQuestion = new Question();
      mockQuestion.id = questionId;
      mockQuestion.title = 'Mock Question';

      const expectedResult: QuestionView = {
        id: 'view1',
        user: mockUser,
        question: mockQuestion,
        last_seen_at: new Date(),
      };

      questionViewRepo.findOne.mockResolvedValue(expectedResult);

      const result = await service.getLastSeen(questionId, userId);

      expect(questionViewRepo.findOne).toHaveBeenCalledWith({
        where: { question: { id: questionId }, user: { id: userId } },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findUnread', () => {
    it('should call query builder and return raw results', async () => {
      const userId = 'u1';

      const mockQueryBuilder: QueryBuilderMock = {
        innerJoin: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        distinctOn: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([{ questionId: 'q1', message: 'msg' }]),
      };

      conversationRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findUnread(userId);

      expect(conversationRepo.createQueryBuilder).toHaveBeenCalledWith('c');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith(
        'question_view',
        'qv',
        'qv.question_id = q.id AND qv.user_id = :userId',
        { userId },
      );
      expect(result).toEqual([{ questionId: 'q1', message: 'msg' }]);
    });
  });
});
