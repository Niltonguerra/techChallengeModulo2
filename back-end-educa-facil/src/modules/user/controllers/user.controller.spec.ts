import { APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CreateUserUseCase } from '../usecases/createUser.usecase';
import { FindOneUserUseCase } from '../usecases/FindOneUser.usecase';
import { CreateUserDTO } from '../dtos/createUser.dto';
import { FindOneUserQueryParamsDTO } from '../dtos/findOneQueryParams.dto';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { FindOneUserReturnMessageDTO } from '../dtos/returnMessageCRUD.dto';
import { UserPermissionEnum } from '../enum/permission.enum';
import { searchByFieldUserEnum } from '../enum/searchByFieldUser.enum';
import { JwtService } from '@nestjs/jwt';
// importação removida, guard será sobrescrito via overrideGuard

describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: CreateUserUseCase;
  let findOneUserUseCase: FindOneUserUseCase;

  beforeEach(async () => {
    const jwtServiceMock = { sign: jest.fn(), verify: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: {
            validationEmailCreateUser: jest.fn(() => Promise.resolve()),
            create: jest.fn(() => Promise.resolve()),
          },
        },
        {
          provide: FindOneUserUseCase,
          useValue: {
            findOneUserUseCase: jest.fn(() => Promise.resolve()),
          },
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: APP_GUARD,
          useValue: { canActivate: () => true },
        },
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
    const dto: CreateUserDTO = {
      email: 'test@email.com',
      password: '123',
      name: 'Test',
      photo: '',
      permission: UserPermissionEnum.ADMIN,
      notification: false,
    };
    const expected: ReturnMessageDTO = { message: 'ok', statusCode: 200 };
    jest.spyOn(createUserUseCase, 'validationEmailCreateUser').mockResolvedValue(expected);

    const result = await controller.CreateUser(dto);
    expect(result).toBe(expected);
    expect(createUserUseCase.validationEmailCreateUser as jest.Mock).toHaveBeenCalledWith(dto);
  });

  it('deve validar email com sucesso', async () => {
    const token = 'token123';
    const expected: ReturnMessageDTO = { message: 'valid', statusCode: 200 };
    jest.spyOn(createUserUseCase, 'create').mockResolvedValue(expected);

    const result = await controller.validationEmail(token);
    expect(result).toBe(expected);
    expect(createUserUseCase.create as jest.Mock).toHaveBeenCalledWith(token);
  });

  it('deve buscar usuário com sucesso', async () => {
    const query: FindOneUserQueryParamsDTO = {
      field: searchByFieldUserEnum.EMAIL,
      value: 'test@email.com',
    };
    const expected: FindOneUserReturnMessageDTO = {
      statusCode: 200,
      message: 'ok',
      user: {
        id: '1',
        name: 'Test',
        photo: '',
        email: 'test@email.com',
        social_midia: {},
        notification: false,
      },
    };
    jest.spyOn(findOneUserUseCase, 'findOneUserUseCase').mockResolvedValue(expected);

    const result = await controller.FindOne(query);
    expect(result).toBe(expected);
    expect(findOneUserUseCase.findOneUserUseCase as jest.Mock).toHaveBeenCalledWith(query);
  });

  it('deve propagar erro do usecase ao criar usuário', async () => {
    const dto: CreateUserDTO = {
      email: 'fail@email.com',
      password: '123',
      name: 'Fail',
      photo: '',
      permission: UserPermissionEnum.ADMIN,
      notification: false,
    };
    jest.spyOn(createUserUseCase, 'validationEmailCreateUser').mockRejectedValue(new Error('erro'));
    await expect(controller.CreateUser(dto)).rejects.toThrow('erro');
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
    await expect(controller.FindOne(query)).rejects.toThrow('erro');
  });
});
