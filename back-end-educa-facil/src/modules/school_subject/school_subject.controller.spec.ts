import { Test, TestingModule } from '@nestjs/testing';
import { SchoolSubjectController } from './school_subject.controller';
import { GetSchoolSubjectCase } from './usecases/getSchoolSubject.usecase';
import { SchoolSubjectDropdownDto } from './dto/get-shcool_subject.dto';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardStudent } from '@modules/auth/guards/roles-student.guard';

describe('SchoolSubjectController', () => {
  let controller: SchoolSubjectController;
  let useCase: GetSchoolSubjectCase;

  const mockUseCase = {
    getDropdownUseCase: jest.fn(),
  };

  const mockGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolSubjectController],
      providers: [
        {
          provide: GetSchoolSubjectCase,
          useValue: mockUseCase,
        },
      ],
    })
      .overrideGuard(JwtAuthGuardUser)
      .useValue(mockGuard)
      .overrideGuard(RolesGuardStudent)
      .useValue(mockGuard)
      .compile();

    controller = module.get<SchoolSubjectController>(SchoolSubjectController);
    useCase = module.get<GetSchoolSubjectCase>(GetSchoolSubjectCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return dropdown subjects', async () => {
    const mockResponse: SchoolSubjectDropdownDto[] = [
      { label: 'Matemática', value: '1' },
      { label: 'Português', value: '2' },
    ];

    jest.spyOn(useCase, 'getDropdownUseCase').mockResolvedValue(mockResponse);

    const result = await controller.getDropdown();

    expect(result).toEqual(mockResponse);
    expect(useCase.getDropdownUseCase).toHaveBeenCalledTimes(1);
  });
});
