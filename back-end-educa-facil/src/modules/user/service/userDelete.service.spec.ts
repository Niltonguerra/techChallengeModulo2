import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserDeleteService } from './userDelete.service';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { mockUser } from '@modules/post/service/__mocks__/post.service.mock';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';

const mockReturnMessageDTO: ReturnMessageDTO = {
  statusCode: 200,
  message: systemMessage.ReturnMessage.successDeleteUser,
};
describe('UserDeleteService', () => {
  let userDeleteService: UserDeleteService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDeleteService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
            remove: jest.fn().mockResolvedValue(mockReturnMessageDTO),
          },
        },
      ],
    }).compile();

    userDeleteService = module.get<UserDeleteService>(UserDeleteService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userDeleteService).toBeDefined();
  });

  it('should delete a user successfully', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(userRepository, 'remove').mockResolvedValue(mockUser);

    const result = await userDeleteService.deleteUser('test-id');

    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 'test-id' } });
    expect(userRepository.remove).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockReturnMessageDTO);
  });

  it('should return an error if the user is not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    const result = await userDeleteService.deleteUser('test-id');

    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 'test-id' } });
    expect(userRepository.remove).not.toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: 404,
      message: systemMessage.ReturnMessage.errorUserNotFound,
    });
  });

  it('should handle exceptions', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error('Test error'));

    try {
      await userDeleteService.deleteUser('test-id');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(error.message).toBe('Test error');
    }
  });
});
