import { Test, TestingModule } from '@nestjs/testing';
import { QuestionViewService } from './question_view.service';

describe('QuestionService', () => {
  let service: QuestionViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionViewService],
    }).compile();

    service = module.get<QuestionViewService>(QuestionViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
