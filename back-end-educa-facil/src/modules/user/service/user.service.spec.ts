import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { IUser } from '../entities/interfaces/user.interface';
<<<<<<< HEAD
import { UserPermissionEnum } from '../enum/permission.enum';
import { UserStatusEnum } from '../enum/status.enum';
=======
>>>>>>> main
import { systemMessage } from '@config/i18n/pt/systemMessage';

jest.mock('uuid', () => ({ v4: () => 'mocked-uuid-123' }));

describe('UserService', () => {
  let service: UserService;
<<<<<<< HEAD
  let mockRepository: {
    save: jest.Mock;
    findOne: jest.Mock;
    find: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123',
    photo: 'https://example.com/photo.jpg',
    social_midia: { twitter: '@testuser' },
    permission: UserPermissionEnum.USER,
    isActive: UserStatusEnum.ACTIVE,
    notification: true,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
    posts: [],
  };
=======
  let mockRepository: { save: jest.Mock; findOne: jest.Mock };
>>>>>>> main

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: getRepositoryToken(User), useValue: mockRepository }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUpdateUser', () => {
<<<<<<< HEAD
    it('should create a new user with generated ID', async () => {
      // Arrange
      const createUserData: Partial<IUser> = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        photo: 'https://example.com/new-photo.jpg',
        social_midia: { linkedin: 'linkedin.com/in/newuser' },
        permission: UserPermissionEnum.USER,
        isActive: UserStatusEnum.ACTIVE,
        notification: true,
      };

      mockRepository.save.mockResolvedValue(mockUser);

      // Act
      const result = await service.createUpdateUser(createUserData);

      // Assert
=======
    it('deve criar um novo usuário com id gerado', async () => {
      mockRepository.save.mockResolvedValue({} as User);
      const data: Partial<IUser> = { name: 'Fulano', email: 'fulano@email.com' };
      const result = await service.createUpdateUser(data);
      expect(mockRepository.save).toHaveBeenCalledWith({ id: 'mocked-uuid-123', ...data });
>>>>>>> main
      expect(result).toEqual({
        message: systemMessage.ReturnMessage.sucessCreateUser,
        statusCode: 200,
      });
    });

    it('deve atualizar usuário com id fornecido', async () => {
      mockRepository.save.mockResolvedValue({} as User);
      const data: Partial<IUser> = { id: '123', name: 'Fulano' };
      const result = await service.createUpdateUser(data);
      expect(mockRepository.save).toHaveBeenCalledWith({ id: '123', ...data });
      expect(result).toEqual({
        message: systemMessage.ReturnMessage.sucessCreateUser,
        statusCode: 200,
      });
    });

    it('deve lançar erro se o save falhar', async () => {
      mockRepository.save.mockRejectedValue(new Error('erro'));
      await expect(service.createUpdateUser({ name: 'X' })).rejects.toThrow('erro');
    });
  });

  describe('findOneUser', () => {
    it('deve retornar mensagem de erro se usuário não encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const result = await service.findOneUser('email', 'naoexiste@email.com');
      expect(result).toEqual({
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      });
    });

    it('deve retornar usuário se encontrado', async () => {
      const user = {
        id: '1',
        name: 'Fulano',
        photo: 'foto.png',
        email: 'fulano@email.com',
        social_midia: 'twitter',
        notification: true,
      };
      mockRepository.findOne.mockResolvedValue(user);
      const result = await service.findOneUser('email', 'fulano@email.com');
      expect(result).toEqual({
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user,
      });
    });
  });

  describe('findOneUserLogin', () => {
    it('deve retornar false se usuário não encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(false);
      const result = await service.findOneUserLogin('naoexiste@email.com');
      expect(result).toBe(false);
    });
<<<<<<< HEAD

    it('should return null when user not found for login', async () => {
      // Arrange
      const email = 'notfound@example.com';

      mockRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findOneUserLogin(email);

      // Assert
      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should handle special email formats', async () => {
      // Arrange
      const email = 'user+test@example.co.uk';
      const userWithSpecialEmail = { ...mockUser, email };

      mockRepository.findOne.mockResolvedValue(userWithSpecialEmail);

      // Act
      const result = await service.findOneUserLogin(email);

      // Assert
      expect(result).toEqual({
        id: userWithSpecialEmail.id,
        password: userWithSpecialEmail.password,
        name: userWithSpecialEmail.name,
        email: userWithSpecialEmail.email,
        permission: userWithSpecialEmail.permission,
      });

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should handle database query errors in login', async () => {
      // Arrange
      const email = 'test@example.com';
      const dbError = new Error('Database connection lost');

      mockRepository.findOne.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.findOneUserLogin(email)).rejects.toThrow(dbError);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should return user data with different permissions', async () => {
      // Arrange
      const email = 'admin@example.com';
      const adminUser = {
        ...mockUser,
        email,
        permission: UserPermissionEnum.ADMIN,
        isActive: UserStatusEnum.ACTIVE,
=======
    it('deve retornar dados do usuário para login', async () => {
      const user = {
        id: '1',
        password: 'senha',
        name: 'Fulano',
        email: 'fulano@email.com',
        permission: 'admin',
        isActive: 'active',
>>>>>>> main
      };
      mockRepository.findOne.mockResolvedValue(user);
      const result = await service.findOneUserLogin('fulano@email.com');
      expect(result).toEqual({
        id: '1',
        password: 'senha',
        name: 'Fulano',
        email: 'fulano@email.com',
        permission: 'admin',
        isActive: 'active',
      });
    });
  });
});
