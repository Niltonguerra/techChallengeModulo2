import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { userMock, userCreateMock } from './__mocks__/user-service.mock';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const userRepositoryMock = {
      save: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('deve criar usuário com sucesso', async () => {
    (userRepository.save as jest.Mock).mockResolvedValue(userCreateMock);
    const result = await service.createUpdateUser(userCreateMock);
    expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining(userCreateMock));
    expect(result).toEqual({
      message: systemMessage.ReturnMessage.sucessCreateUser,
      statusCode: 200,
    });
  });

  it('deve retornar usuário encontrado', async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(userMock);
    const result = await service.findOneUser('email', userMock.email);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: userMock.email } });
    expect(result).toEqual({
      statusCode: 200,
      message: systemMessage.ReturnMessage.sucessFindOneUser,
      user: {
        id: userMock.id,
        name: userMock.name,
        photo: userMock.photo,
        email: userMock.email,
        social_midia: userMock.social_midia,
        notification: userMock.notification,
      },
    });
  });

  it('deve retornar erro se usuário não encontrado', async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(undefined);
    const result = await service.findOneUser('email', 'notfound@email.com');
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'notfound@email.com' } });
    expect(result).toEqual({
      statusCode: 400,
      message: systemMessage.ReturnMessage.errorUserNotFound,
    });
  });

  it('deve retornar dados para login interno', async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(userMock);
    const result = await service.findOneUserLogin(userMock.email);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: userMock.email } });
    expect(result).toEqual({
      id: userMock.id,
      password: userMock.password,
      name: userMock.name,
      email: userMock.email,
      permission: userMock.permission,
      isActive: userMock.is_active,
    });
  });

  it('deve retornar false se usuário não encontrado para login interno', async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(undefined);
    const result = await service.findOneUserLogin('notfound@email.com');
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'notfound@email.com' } });
    expect(result).toBe(false);
  });
});
