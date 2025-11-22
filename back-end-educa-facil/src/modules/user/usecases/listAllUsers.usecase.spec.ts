import { Test, TestingModule } from '@nestjs/testing';
import { ListAllUsersUseCase } from './listAllUsers.usecase';
import { UserService } from '../service/user.service';
import { UserPermissionEnum } from '@modules/auth/Enum/permission.enum';
import { UserListDTO } from '../dtos/userList.dto';

describe('ListAllUsersUseCase', () => {
  let useCase: ListAllUsersUseCase;
  let userService: UserService;

  const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      permission: UserPermissionEnum.ADMIN,
      photo: 'https://example.com/photo.jpg',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      permission: UserPermissionEnum.USER,
      photo: '',
    },
  ];

  const mockUserService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListAllUsersUseCase, { provide: UserService, useValue: mockUserService }],
    }).compile();

    useCase = module.get<ListAllUsersUseCase>(ListAllUsersUseCase);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should list all users successfully', async () => {
    mockUserService.findAll.mockResolvedValue(mockUsers);

    const result = await useCase.execute();

    expect(userService.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(UserListDTO);
    expect(result[0].id).toBe('1');
    expect(result[1].name).toBe('Jane Smith');
  });

  it('should list all users filtered by permission', async () => {
    mockUserService.findAll.mockResolvedValue([mockUsers[0]]);

    const result = await useCase.execute(UserPermissionEnum.ADMIN);

    expect(userService.findAll).toHaveBeenCalledWith(UserPermissionEnum.ADMIN);
    expect(result).toHaveLength(1);
    expect(result[0].permission).toBe(UserPermissionEnum.ADMIN);
  });

  it('should map undefined fields to empty strings', async () => {
    mockUserService.findAll.mockResolvedValue([
      { id: undefined, email: undefined, name: undefined, permission: undefined, photo: undefined },
    ]);

    const result = await useCase.execute();

    expect(result[0]).toEqual({
      id: '',
      email: '',
      name: '',
      permission: '',
      photo: '',
    });
  });
});
