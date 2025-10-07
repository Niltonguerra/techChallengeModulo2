import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { listAuthorsUseCase } from './listAuthors.usecase';
import { UserService } from '../service/user.service';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { listAuthorsParamsDTO } from '../dtos/listAuthorsParams.dto';
import { searchByFieldUserEnum } from '../enum/searchByFieldUser.enum';
import { ListUserReturnMessageDTO } from '../dtos/returnMessageCRUD.dto';

describe('listAuthorsUseCase', () => {
  let useCase: listAuthorsUseCase;
  let userService: UserService;

  const mockUsers: ListUserReturnMessageDTO = {
    message: 'Authors retrieved successfully',
    statusCode: 200,
    data: [
      {
        id: '1', // ✅ id como string
        name: 'John Doe',
        email: 'john@example.com', // ✅ obrigatório
        photo: 'https://example.com/photo.jpg', // ✅ obrigatório
      },
    ],
  };

  const mockUserService = {
    listAuthors: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        listAuthorsUseCase,
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    useCase = module.get<listAuthorsUseCase>(listAuthorsUseCase);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should list authors successfully', async () => {
    mockUserService.listAuthors.mockResolvedValue(mockUsers);

    const params: listAuthorsParamsDTO = {
      field: searchByFieldUserEnum.NAME,
      value: 'John',
    };
    const result = await useCase.listAuthors(params);

    expect(userService.listAuthors).toHaveBeenCalledWith(searchByFieldUserEnum.NAME, 'John');
    expect(result).toEqual(mockUsers);
  });

  it('should handle HttpException thrown by userService', async () => {
    const error = new HttpException('User not found', HttpStatus.NOT_FOUND);
    mockUserService.listAuthors.mockRejectedValue(error);

    const params: listAuthorsParamsDTO = { field: undefined, value: undefined };

    await expect(useCase.listAuthors(params)).rejects.toThrow(HttpException);
    await expect(useCase.listAuthors(params)).rejects.toThrow('User not found: 404');
  });

  it('should handle generic errors thrown by userService', async () => {
    mockUserService.listAuthors.mockRejectedValue(new Error('Unexpected error'));

    const params: listAuthorsParamsDTO = { field: undefined, value: undefined };

    await expect(useCase.listAuthors(params)).rejects.toThrow(HttpException);
    await expect(useCase.listAuthors(params)).rejects.toThrow(
      `${systemMessage.ReturnMessage.errorUserNotFound}: 500`
    );
  });
});
