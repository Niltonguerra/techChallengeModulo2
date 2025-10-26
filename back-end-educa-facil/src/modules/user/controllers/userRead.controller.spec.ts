import { Test, TestingModule } from '@nestjs/testing';
import { UserReadController } from './userRead.controller';
import { CreateUserUseCase } from '../usecases/createUser.usecase';
import { FindOneUserUseCase } from '../usecases/FindOneUser.usecase';
import { listAuthorsUseCase } from '../usecases/listAuthors.usecase';
import { ListAllUsersUseCase } from '../usecases/listAllUsers.usecase';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardStudent } from '@modules/auth/guards/roles-student.guard';
import { RolesGuardProfessor } from '@modules/auth/guards/roles-professor.guard';
import { mockFindOneUserQuery, mockFindOneUserReturn } from './__mocks__/user.controller.mock';
import { listAuthorsParamsDTO } from '../dtos/listAuthorsParams.dto';
import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';

// Mock de retorno do listAuthorsUseCase
const mockListAuthorsResult = {
  message: 'Authors found',
  statusCode: 200,
  users: [{ id: '1', name: 'Author 1' }],
};

describe('UserController', () => {
  let controller: UserReadController;

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

  const mockListAllUsersUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserReadController],
      providers: [
        { provide: CreateUserUseCase, useValue: mockCreateUserUseCase },
        { provide: FindOneUserUseCase, useValue: mockFindOneUserUseCase },
        { provide: listAuthorsUseCase, useValue: mockListAuthorsUseCase },
        { provide: ListAllUsersUseCase, useValue: mockListAllUsersUseCase },
      ],
    })
      .overrideGuard(JwtAuthGuardUser)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuardStudent)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuardProfessor)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserReadController>(UserReadController);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve buscar usuário com sucesso', async () => {
    mockFindOneUserUseCase.findOneUserUseCase.mockResolvedValue(mockFindOneUserReturn);
    const result = await controller.findOne(mockFindOneUserQuery);
    expect(result).toBe(mockFindOneUserReturn);
    expect(mockFindOneUserUseCase.findOneUserUseCase).toHaveBeenCalledWith(mockFindOneUserQuery);
  });

  it('deve listar autores com sucesso', async () => {
    mockListAuthorsUseCase.listAuthors.mockResolvedValue(mockListAuthorsResult);
    const queryParams: listAuthorsParamsDTO = {};
    const result = await controller.findAllAuthors(queryParams);
    expect(result).toBe(mockListAuthorsResult);
    expect(mockListAuthorsUseCase.listAuthors).toHaveBeenCalledWith(queryParams);
  });

  it('deve listar todos os usuários com sucesso', async () => {
    const mockListAllUsersResult = [{ id: '1', name: 'User 1' }];
    mockListAllUsersUseCase.execute.mockResolvedValue(mockListAllUsersResult);

    const result = await controller.findAllUsers(UserPermissionEnum.ADMIN);
    expect(result).toBe(mockListAllUsersResult);
    expect(mockListAllUsersUseCase.execute).toHaveBeenCalledWith(UserPermissionEnum.ADMIN);
  });

  // ---- TESTES DE ERRO ----

  it('deve propagar erro ao buscar usuário', async () => {
    mockFindOneUserUseCase.findOneUserUseCase.mockRejectedValue(new Error('erro'));
    await expect(controller.findOne(mockFindOneUserQuery)).rejects.toThrow('erro');
  });

  it('deve propagar erro ao listar autores', async () => {
    mockListAuthorsUseCase.listAuthors.mockRejectedValue(new Error('erro'));
    const queryParams: listAuthorsParamsDTO = {};
    await expect(controller.findAllAuthors(queryParams)).rejects.toThrow('erro');
  });

  it('deve propagar erro ao listar todos os usuários', async () => {
    mockListAllUsersUseCase.execute.mockRejectedValue(new Error('erro'));
    await expect(controller.findAllUsers(UserPermissionEnum.USER)).rejects.toThrow('erro');
  });
});
