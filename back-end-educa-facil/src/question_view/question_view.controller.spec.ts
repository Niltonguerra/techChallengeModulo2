import { Test, TestingModule } from '@nestjs/testing';
import { QuestionViewController } from './question_view.controller';
import { QuestionViewService } from './question_view.service';

describe('QuestionController', () => {
  let controller: QuestionViewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionViewController],
      providers: [QuestionViewService],
    }).compile();

    controller = module.get<QuestionViewController>(QuestionViewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
