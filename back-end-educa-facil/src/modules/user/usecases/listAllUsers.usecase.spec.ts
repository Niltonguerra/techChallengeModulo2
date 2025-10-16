import { Test, TestingModule } from '@nestjs/testing';
import { ListAllUsersUseCase } from './listAllUsers.usecase';
import { UserService } from '../service/user.service';
import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';
import { User } from '../entities/user.entity';

describe('ListAllUsersUseCase', () => {
  let useCase: ListAllUsersUseCase;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListAllUsersUseCase,
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<ListAllUsersUseCase>(ListAllUsersUseCase);
    userService = module.get(UserService);
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('deve retornar a lista de usuários sem permissão específica', async () => {
    const mockUsers: Partial<User>[] = [
      { id: '1', name: 'Guilherme' },
      { id: '2', name: 'Felipe' },
    ];

    userService.findAll.mockResolvedValue(mockUsers);

    const result = await useCase.execute();

    expect(userService.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(mockUsers);
  });

  it('deve retornar a lista de usuários com permissão específica', async () => {
    const permission = UserPermissionEnum.ADMIN;
    const mockUsers: Partial<User>[] = [{ id: '3', name: 'Administrador' }];

    userService.findAll.mockResolvedValue(mockUsers);

    const result = await useCase.execute(permission);

    expect(userService.findAll).toHaveBeenCalledWith(permission);
    expect(result).toEqual(mockUsers);
  });

  it('deve propagar erros lançados pelo UserService', async () => {
    userService.findAll.mockRejectedValue(new Error('Erro ao buscar usuários'));

    await expect(useCase.execute()).rejects.toThrow('Erro ao buscar usuários');
    expect(userService.findAll).toHaveBeenCalledTimes(1);
  });
});
