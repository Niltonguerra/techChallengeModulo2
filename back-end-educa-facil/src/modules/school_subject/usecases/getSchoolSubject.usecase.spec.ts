import { Test, TestingModule } from '@nestjs/testing';
import { GetSchoolSubjectCase } from './getSchoolSubject.usecase';
import { SchoolSubjectService } from '../school_subject.service';
import { SchoolSubjectDropdownDto } from '../dto/get-shcool_subject.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { systemMessage } from '@config/i18n/pt/systemMessage';

describe('GetSchoolSubjectCase', () => {
  let useCase: GetSchoolSubjectCase;
  let service: SchoolSubjectService;

  const mockSchoolSubjectService = {
    getSubjectsForDropdown: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSchoolSubjectCase,
        {
          provide: SchoolSubjectService,
          useValue: mockSchoolSubjectService,
        },
      ],
    }).compile();

    useCase = module.get<GetSchoolSubjectCase>(GetSchoolSubjectCase);
    service = module.get<SchoolSubjectService>(SchoolSubjectService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return dropdown subjects successfully', async () => {
    const mockResponse: SchoolSubjectDropdownDto[] = [
      { label: 'Matemática', value: '1' },
      { label: 'Português', value: '2' },
    ];

    jest.spyOn(service, 'getSubjectsForDropdown').mockResolvedValue(mockResponse);

    const result = await useCase.getDropdownUseCase();

    expect(result).toEqual(mockResponse);
    expect(service.getSubjectsForDropdown).toHaveBeenCalledTimes(1);
  });

  it('should throw HttpException when service throws generic error', async () => {
    jest.spyOn(service, 'getSubjectsForDropdown').mockRejectedValue(new Error('Erro qualquer'));

    await expect(useCase.getDropdownUseCase()).rejects.toThrow(HttpException);

    await expect(useCase.getDropdownUseCase()).rejects.toMatchObject({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `${systemMessage.ReturnMessage.errorGetDropdown}: ${HttpStatus.INTERNAL_SERVER_ERROR}`,
    });
  });

  it('should rethrow HttpException from service preserving status', async () => {
    const httpError = new HttpException('Erro customizado', HttpStatus.BAD_REQUEST);

    jest.spyOn(service, 'getSubjectsForDropdown').mockRejectedValue(httpError);

    await expect(useCase.getDropdownUseCase()).rejects.toThrow(HttpException);

    await expect(useCase.getDropdownUseCase()).rejects.toMatchObject({
      status: HttpStatus.BAD_REQUEST,
      message: `Erro customizado: ${HttpStatus.BAD_REQUEST}`,
    });
  });
});
