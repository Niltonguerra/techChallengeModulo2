import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CreateUserUseCase } from '../usecases/createUser.usecase';
import { FindOneUserUseCase } from '../usecases/FindOneUser.usecase';
import { listAuthorsUseCase } from '../usecases/listAuthors.usecase';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardStudent } from '@modules/auth/guards/roles-student.guard';
import {
  mockCreateUserDTO,
  mockFindOneUserQuery,
  mockFindOneUserReturn,
  mockReturnMessageDTO,
  mockReturnMessageDTOValid,
  mockToken,
} from './__mocks__/user.controller.mock';
import { listAuthorsParamsDTO } from '../dtos/listAuthorsParams.dto';

// Criando mock do retorno de listAuthors
const mockListAuthorsResult = {
  message: 'Authors found',
  statusCode: 200,
  users: [{ id: '1', name: 'Author 1' }],
};

describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: CreateUserUseCase;
  let findOneUserUseCase: FindOneUserUseCase;
  let listAuthorsUseCaseMock: listAuthorsUseCase;

  const mockCreateUserUseCase = {
    validationEmailCreateUser: jest.fn(),
    create: jest.fn(),
  };

  const mockFindOneUserUseCase = {
    findOneUserUseCase: jest.fn(),
  };

  const mockListAuthorsUseCase = {
    listAuthors: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: CreateUserUseCase, useValue: mockCreateUserUseCase },
        { provide: FindOneUserUseCase, useValue: mockFindOneUserUseCase },
        { provide: listAuthorsUseCase, useValue: mockListAuthorsUseCase },
      ],
    })
      .overrideGuard(JwtAuthGuardUser)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuardStudent)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserController>(UserController);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    findOneUserUseCase = module.get<FindOneUserUseCase>(FindOneUserUseCase);
    listAuthorsUseCaseMock = module.get<listAuthorsUseCase>(listAuthorsUseCase);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve criar usuário com sucesso', async () => {
    mockCreateUserUseCase.validationEmailCreateUser.mockResolvedValue(mockReturnMessageDTO);
    const result = await controller.createUser(mockCreateUserDTO);
    expect(result).toBe(mockReturnMessageDTO);
    expect(mockCreateUserUseCase.validationEmailCreateUser).toHaveBeenCalledWith(mockCreateUserDTO);
  });

  it('deve validar email com sucesso', async () => {
    mockCreateUserUseCase.create.mockResolvedValue(mockReturnMessageDTOValid);
    const result = await controller.validationEmail(mockToken);
    expect(result).toBe(mockReturnMessageDTOValid);
    expect(mockCreateUserUseCase.create).toHaveBeenCalledWith(mockToken);
  });

  it('deve buscar usuário com sucesso', async () => {
    mockFindOneUserUseCase.findOneUserUseCase.mockResolvedValue(mockFindOneUserReturn);
    const result = await controller.findOne(mockFindOneUserQuery);
    expect(result).toBe(mockFindOneUserReturn);
    expect(mockFindOneUserUseCase.findOneUserUseCase).toHaveBeenCalledWith(mockFindOneUserQuery);
  });

  it('deve listar autores com sucesso', async () => {
    mockListAuthorsUseCase.listAuthors.mockResolvedValue(mockListAuthorsResult);
    const queryParams: listAuthorsParamsDTO = {}; // apenas propriedades válidas do DTO
    const result = await controller.findAllAuthors(queryParams);
    expect(result).toBe(mockListAuthorsResult);
    expect(mockListAuthorsUseCase.listAuthors).toHaveBeenCalledWith(queryParams);
  });

  it('deve propagar erro ao criar usuário', async () => {
    mockCreateUserUseCase.validationEmailCreateUser.mockRejectedValue(new Error('erro'));
    await expect(controller.createUser(mockCreateUserDTO)).rejects.toThrow('erro');
  });

  it('deve propagar erro ao validar email', async () => {
    mockCreateUserUseCase.create.mockRejectedValue(new Error('erro'));
    await expect(controller.validationEmail(mockToken)).rejects.toThrow('erro');
  });

  it('deve propagar erro ao buscar usuário', async () => {
    mockFindOneUserUseCase.findOneUserUseCase.mockRejectedValue(new Error('erro'));
    await expect(controller.findOne(mockFindOneUserQuery)).rejects.toThrow('erro');
  });

  it('deve propagar erro ao listar autores', async () => {
    mockListAuthorsUseCase.listAuthors.mockRejectedValue(new Error('erro'));
    const queryParams: listAuthorsParamsDTO = {};
    await expect(controller.findAllAuthors(queryParams)).rejects.toThrow('erro');
  });
});
