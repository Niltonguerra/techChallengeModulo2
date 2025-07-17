import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { IUser } from '../entities/interfaces/user.interface';
import { UserPermissionEnum } from '../enum/permission.enum';
import { UserStatusEnum } from '../enum/status.enum';
import { systemMessage } from '@config/i18n/pt/systemMessage';

// Mock do uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-123'),
}));

describe('UserService', () => {
  let service: UserService;
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

  beforeEach(async () => {
    // Mock do repository
    mockRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialização', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('createUpdateUser', () => {
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
      expect(result).toEqual({
        message: systemMessage.ReturnMessage.sucessCreateUser,
        statusCode: 200,
      });

      expect(mockRepository.save).toHaveBeenCalledWith({
        id: 'mocked-uuid-123',
        ...createUserData,
      });
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should update existing user with provided ID', async () => {
      // Arrange
      const existingUserId = '123e4567-e89b-12d3-a456-426614174000';
      const updateUserData: Partial<IUser> = {
        id: existingUserId,
        name: 'Updated User',
        email: 'updated@example.com',
        notification: false,
      };

      mockRepository.save.mockResolvedValue(mockUser);

      // Act
      const result = await service.createUpdateUser(updateUserData);

      // Assert
      expect(result).toEqual({
        message: systemMessage.ReturnMessage.sucessCreateUser,
        statusCode: 200,
      });

      expect(mockRepository.save).toHaveBeenCalledWith({
        id: existingUserId,
        ...updateUserData,
      });
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should handle partial user data', async () => {
      // Arrange
      const partialUserData: Partial<IUser> = {
        name: 'Partial User',
        email: 'partial@example.com',
      };

      mockRepository.save.mockResolvedValue(mockUser);

      // Act
      const result = await service.createUpdateUser(partialUserData);

      // Assert
      expect(result).toEqual({
        message: systemMessage.ReturnMessage.sucessCreateUser,
        statusCode: 200,
      });

      expect(mockRepository.save).toHaveBeenCalledWith({
        id: 'mocked-uuid-123',
        ...partialUserData,
      });
    });

    it('should handle database save errors', async () => {
      // Arrange
      const createUserData: Partial<IUser> = {
        name: 'Error User',
        email: 'error@example.com',
      };

      const dbError = new Error('Database connection failed');
      mockRepository.save.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.createUpdateUser(createUserData)).rejects.toThrow(dbError);
      expect(mockRepository.save).toHaveBeenCalledWith({
        id: 'mocked-uuid-123',
        ...createUserData,
      });
    });
  });

  describe('findOneUser', () => {
    it('should find user by email successfully', async () => {
      // Arrange
      const field = 'email';
      const value = 'test@example.com';

      mockRepository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.findOneUser(field, value);

      // Assert
      expect(result).toEqual({
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          photo: mockUser.photo,
          email: mockUser.email,
          social_midia: mockUser.social_midia,
          notification: mockUser.notification,
        },
      });

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { [field]: value },
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should find user by id successfully', async () => {
      // Arrange
      const field = 'id';
      const value = '123e4567-e89b-12d3-a456-426614174000';

      mockRepository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.findOneUser(field, value);

      // Assert
      expect(result).toEqual({
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          photo: mockUser.photo,
          email: mockUser.email,
          social_midia: mockUser.social_midia,
          notification: mockUser.notification,
        },
      });

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: value },
      });
    });

    it('should return error when user not found', async () => {
      // Arrange
      const field = 'email';
      const value = 'notfound@example.com';

      mockRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findOneUser(field, value);

      // Assert
      expect(result).toEqual({
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      });

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { [field]: value },
      });
    });

    it('should handle different field types', async () => {
      // Arrange
      const field = 'name';
      const value = 'Test User';

      mockRepository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.findOneUser(field, value);

      // Assert
      expect(result).toEqual({
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          photo: mockUser.photo,
          email: mockUser.email,
          social_midia: mockUser.social_midia,
          notification: mockUser.notification,
        },
      });

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { name: value },
      });
    });

    it('should handle database query errors', async () => {
      // Arrange
      const field = 'email';
      const value = 'test@example.com';
      const dbError = new Error('Database query failed');

      mockRepository.findOne.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.findOneUser(field, value)).rejects.toThrow(dbError);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { [field]: value },
      });
    });
  });

  describe('findOneUserLogin', () => {
    it('should find user for login successfully', async () => {
      // Arrange
      const email = 'test@example.com';

      mockRepository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.findOneUserLogin(email);

      // Assert
      expect(result).toEqual({
        id: mockUser.id,
        password: mockUser.password,
        name: mockUser.name,
        email: mockUser.email,
        permission: mockUser.permission,
      });

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

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
      };

      mockRepository.findOne.mockResolvedValue(adminUser);

      // Act
      const result = await service.findOneUserLogin(email);

      // Assert
      expect(result).toEqual({
        id: adminUser.id,
        password: adminUser.password,
        name: adminUser.name,
        email: adminUser.email,
        permission: adminUser.permission,
      });
    });
  });

  describe('Integration scenarios', () => {
    it('should handle empty string values gracefully', async () => {
      // Arrange
      const field = 'email';
      const value = '';

      mockRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findOneUser(field, value);

      // Assert
      expect(result).toEqual({
        statusCode: 400,
        message: systemMessage.ReturnMessage.errorUserNotFound,
      });

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: '' },
      });
    });

    it('should handle user with empty social_midia', async () => {
      // Arrange
      const userWithEmptySocial = { ...mockUser, social_midia: {} };
      const field = 'email';
      const value = 'test@example.com';

      mockRepository.findOne.mockResolvedValue(userWithEmptySocial);

      // Act
      const result = await service.findOneUser(field, value);

      // Assert
      expect(result).toEqual({
        statusCode: 200,
        message: systemMessage.ReturnMessage.sucessGetPostById,
        user: {
          id: userWithEmptySocial.id,
          name: userWithEmptySocial.name,
          photo: userWithEmptySocial.photo,
          email: userWithEmptySocial.email,
          social_midia: {},
          notification: userWithEmptySocial.notification,
        },
      });
    });
  });
});
