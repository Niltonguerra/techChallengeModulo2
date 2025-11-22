import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { userCreateMock, userMock } from './__mocks__/user-service.mock';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';
import { searchByFieldUserEnum } from '../enum/searchByFieldUser.enum';
import { UserStatusEnum } from '../enum/status.enum';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const repositoryMock = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([userMock]),
      }),
    } as unknown as jest.Mocked<Repository<User>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(getRepositoryToken(User));
  });

  it('deve criar usuário com sucesso', async () => {
    repository.save.mockResolvedValue(userCreateMock as any);

    const result = await service.createUpdateUser(userCreateMock);

    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(userCreateMock));
    expect(result).toEqual({
      message: systemMessage.ReturnMessage.sucessCreateUser,
      statusCode: 200,
    });
  });

  it('deve retornar usuário encontrado', async () => {
    repository.findOne.mockResolvedValue(userMock as any);

    const result = await service.findOneUser(
      searchByFieldUserEnum.EMAIL,
      userMock.email,
      UserStatusEnum.ACTIVE,
    );

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: userMock.email, is_active: UserStatusEnum.ACTIVE },
    });
    expect(result).toEqual({
      statusCode: 200,
      message: systemMessage.ReturnMessage.sucessFindOneUser,
      user: {
        id: userMock.id,
        name: userMock.name,
        photo: userMock.photo,
        email: userMock.email,
      },
    });
  });

  it('deve retornar erro se usuário não encontrado', async () => {
    repository.findOne.mockResolvedValue(null);

    const result = await service.findOneUser(
      searchByFieldUserEnum.EMAIL,
      'notfound@email.com',
      UserStatusEnum.ACTIVE,
    );

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: 'notfound@email.com', is_active: UserStatusEnum.ACTIVE },
    });
    expect(result).toEqual({
      statusCode: 400,
      message: systemMessage.ReturnMessage.errorUserNotFound,
    });
  });

  it('deve retornar dados para login interno', async () => {
    repository.findOne.mockResolvedValue(userMock as any);

    const result = await service.findOneUserLogin(userMock.email);

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: userMock.email, is_active: UserStatusEnum.ACTIVE },
    });
    expect(result).toEqual({
      id: userMock.id,
      password: userMock.password,
      name: userMock.name,
      email: userMock.email,
      permission: userMock.permission,
      isActive: userMock.is_active,
      photo: userMock.photo,
    });
  });

  it('deve retornar false se usuário não encontrado para login interno', async () => {
    repository.findOne.mockResolvedValue(null);

    const result = await service.findOneUserLogin('notfound@email.com');

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: 'notfound@email.com', is_active: UserStatusEnum.ACTIVE },
    });
    expect(result).toBe(false);
  });

  it('deve listar autores com sucesso', async () => {
    const result = await service.listAuthors('', '');

    expect(repository.createQueryBuilder).toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: 200,
      message: systemMessage.ReturnMessage.successListUsers,
      data: [userMock],
    });
  });

  it('deve retornar todos usuários com permissão específica', async () => {
    repository.find.mockResolvedValue([userMock as any]);

    const result = await service.findAll(UserPermissionEnum.ADMIN);

    expect(repository.find).toHaveBeenCalledWith({
      select: ['id', 'name', 'email', 'permission', 'photo', 'is_active'],
      where: { permission: UserPermissionEnum.ADMIN, is_active: UserStatusEnum.ACTIVE },
    });
    expect(result).toEqual([userMock]);
  });
});
