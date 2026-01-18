import { Test, TestingModule } from '@nestjs/testing';
import { SchoolSubjectService } from './school_subject.service';

describe('SchoolSubjectService', () => {
  let service: SchoolSubjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchoolSubjectService],
    }).compile();

    service = module.get<SchoolSubjectService>(SchoolSubjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
