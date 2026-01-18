import { Test, TestingModule } from '@nestjs/testing';
import { SchoolSubjectController } from './school_subject.controller';
import { SchoolSubjectService } from './school_subject.service';

describe('SchoolSubjectController', () => {
  let controller: SchoolSubjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolSubjectController],
      providers: [SchoolSubjectService],
    }).compile();

    controller = module.get<SchoolSubjectController>(SchoolSubjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
