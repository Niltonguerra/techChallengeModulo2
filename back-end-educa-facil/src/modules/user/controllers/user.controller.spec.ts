import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from '../dtos/createUser.dto';
import { FindOneUserQueryParamsDTO } from '../dtos/findOneQueryParams.dto';
import { searchByFieldUserEnum } from '../enum/searchByFieldUser.enum';
import { CreateUserUseCase } from '../usecases/createUser.usecase';
import { FindOneUserUseCase } from '../usecases/FindOneUser.usecase';
import {
  mockAppGuard,
  mockCreateUserDTO,
  mockCreateUserUseCase,
  mockFindOneUserQuery,
  mockFindOneUserReturn,
  mockFindOneUserUseCase,
  mockJwtService,
  mockReturnMessageDTO,
  mockReturnMessageDTOValid,
  mockToken,
} from './__mocks__/user.controller.mock';
import { UserController } from './user.controller';
// importação removida, guard será sobrescrito via overrideGuard
describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: CreateUserUseCase;
  let findOneUserUseCase: FindOneUserUseCase;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: CreateUserUseCase, useValue: mockCreateUserUseCase },
        { provide: FindOneUserUseCase, useValue: mockFindOneUserUseCase },
        { provide: JwtService, useValue: mockJwtService },
        { provide: APP_GUARD, useValue: mockAppGuard },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    findOneUserUseCase = module.get<FindOneUserUseCase>(FindOneUserUseCase);
  });
  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });
  it('deve criar usuário com sucesso', async () => {
    jest
      .spyOn(createUserUseCase, 'validationEmailCreateUser')
      .mockResolvedValue(mockReturnMessageDTO);
    const result = await controller.createUser(mockCreateUserDTO);
    expect(result).toBe(mockReturnMessageDTO);
    expect(createUserUseCase.validationEmailCreateUser as jest.Mock).toHaveBeenCalledWith(
      mockCreateUserDTO,
    );
  });
  it('deve validar email com sucesso', async () => {
    jest.spyOn(createUserUseCase, 'create').mockResolvedValue(mockReturnMessageDTOValid);
    const result = await controller.validationEmail(mockToken);
    expect(result).toBe(mockReturnMessageDTOValid);
    expect(createUserUseCase.create as jest.Mock).toHaveBeenCalledWith(mockToken);
  });
  it('deve buscar usuário com sucesso', async () => {
    jest.spyOn(findOneUserUseCase, 'findOneUserUseCase').mockResolvedValue(mockFindOneUserReturn);
    const result = await controller.findOne(mockFindOneUserQuery);
    expect(result).toBe(mockFindOneUserReturn);
    expect(findOneUserUseCase.findOneUserUseCase as jest.Mock).toHaveBeenCalledWith(
      mockFindOneUserQuery,
    );
  });
  it('deve propagar erro do usecase ao criar usuário', async () => {
    const dto: CreateUserDTO = {
      email: 'fail@email.com',
      password: '123',
      name: 'Fail',
      photo: '',
      permission: UserPermissionEnum.ADMIN,
    };
    jest.spyOn(createUserUseCase, 'validationEmailCreateUser').mockRejectedValue(new Error('erro'));
    await expect(controller.createUser(dto)).rejects.toThrow('erro');
  });
  it('deve propagar erro do usecase ao validar email', async () => {
    jest.spyOn(createUserUseCase, 'create').mockRejectedValue(new Error('erro'));
    await expect(controller.validationEmail('token')).rejects.toThrow('erro');
  });
  it('deve propagar erro do usecase ao buscar usuário', async () => {
    const query: FindOneUserQueryParamsDTO = {
      field: searchByFieldUserEnum.EMAIL,
      value: 'x',
    };
    jest.spyOn(findOneUserUseCase, 'findOneUserUseCase').mockRejectedValue(new Error('erro'));
    await expect(controller.findOne(query)).rejects.toThrow('erro');
  });
});