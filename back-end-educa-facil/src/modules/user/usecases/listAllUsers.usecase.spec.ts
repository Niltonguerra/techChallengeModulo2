import { ListAllUsersUseCase } from './listAllUsers.usecase';
import { UserService } from '../service/user.service';
import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';
import { UserListDTO } from '../dtos/userList.dto';

describe('ListAllUsersUseCase', () => {
  let listAllUsersUseCase: ListAllUsersUseCase;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    userService = {
      findAll: jest.fn(),
    } as any;

    listAllUsersUseCase = new ListAllUsersUseCase(userService);
  });

  it('deve retornar uma lista de usuários mapeados para UserListDTO', async () => {
    const mockUsers = [
      {
        id: '1',
        email: 'user1@example.com',
        name: 'User One',
        permission: UserPermissionEnum.USER,
      },
      {
        id: '2',
        email: 'user2@example.com',
        name: 'User Two',
        permission: UserPermissionEnum.ADMIN,
      },
    ];

    userService.findAll.mockResolvedValue(mockUsers);

    const result = await listAllUsersUseCase.execute();

    expect(userService.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(UserListDTO);
    expect(result[0]).toEqual({
      id: '1',
      email: 'user1@example.com',
      name: 'User One',
      permission: UserPermissionEnum.USER,
    });
  });

  it('deve chamar o serviço com o parâmetro de permissão', async () => {
    const permission = UserPermissionEnum.ADMIN;
    userService.findAll.mockResolvedValue([]);

    await listAllUsersUseCase.execute(permission);

    expect(userService.findAll).toHaveBeenCalledWith(permission);
  });

  it('deve retornar um array vazio se nenhum usuário for encontrado', async () => {
    userService.findAll.mockResolvedValue([]);

    const result = await listAllUsersUseCase.execute();

    expect(result).toEqual([]);
  });

  it('deve lidar com campos ausentes em um usuário retornado', async () => {
    userService.findAll.mockResolvedValue([
      {
        id: undefined,
        email: undefined,
        name: undefined,
        permission: undefined,
      },
    ]);

    const result = await listAllUsersUseCase.execute();

    expect(result[0]).toEqual({
      id: '',
      email: '',
      name: '',
      permission: '',
    });
  });
});
