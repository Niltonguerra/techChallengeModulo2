import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchoolSubjectService } from './school_subject.service';
import { SchoolSubject } from './entities/school_subject.entity';
import { SchoolSubjectDropdownDto } from './dto/get-shcool_subject.dto';

describe('SchoolSubjectService', () => {
  let service: SchoolSubjectService;
  let repository: Repository<SchoolSubject>;

  const mockQueryBuilder = {
    innerJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
  };

  const mockRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolSubjectService,
        {
          provide: getRepositoryToken(SchoolSubject),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SchoolSubjectService>(SchoolSubjectService);
    repository = module.get<Repository<SchoolSubject>>(getRepositoryToken(SchoolSubject));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return subjects formatted for dropdown', async () => {
    const mockResult: SchoolSubjectDropdownDto[] = [
      { label: 'Matemática', value: '1' },
      { label: 'Português', value: '2' },
    ];

    mockQueryBuilder.getRawMany.mockResolvedValue(mockResult);

    const result = await service.getSubjectsForDropdown();

    expect(result).toEqual(mockResult);

    expect(repository.createQueryBuilder).toHaveBeenCalledWith('subject');
    expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith('subject.questions', 'question');
    expect(mockQueryBuilder.select).toHaveBeenCalledWith([
      'DISTINCT ON (subject.id) subject.id AS value',
      'subject.name AS label',
    ]);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('subject.id');
    expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith('LOWER(subject.name)', 'ASC');
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalled();
  });
});
