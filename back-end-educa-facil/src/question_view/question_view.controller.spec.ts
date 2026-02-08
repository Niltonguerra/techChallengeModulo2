import { Test, TestingModule } from '@nestjs/testing';
import { QuestionViewController } from './question_view.controller';
import { QuestionViewService } from './question_view.service';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';

describe('QuestionViewController', () => {
  let controller: QuestionViewController;
  let service: QuestionViewService;

  const mockQuestionViewService = {
    findUnread: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: () => true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionViewController],
      providers: [{ provide: QuestionViewService, useValue: mockQuestionViewService }],
    })
      .overrideGuard(JwtAuthGuardUser)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<QuestionViewController>(QuestionViewController);
    service = module.get<QuestionViewService>(QuestionViewService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('unread', () => {
    it('should call questionViewService.findUnread with the correct user id', async () => {
      const user = { id: 'user-123' };
      const expectedResult = [{ id: 1, message: 'Nova dúvida' }];
      mockQuestionViewService.findUnread.mockResolvedValue(expectedResult);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await controller.unread(user as any);

      expect(service.findUnread).toHaveBeenCalledWith(user.id);
      expect(result).toEqual(expectedResult);
    });
  });
});
