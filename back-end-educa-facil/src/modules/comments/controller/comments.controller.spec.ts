import { systemMessage } from '@config/i18n/pt/systemMessage';
import { JwtAuthGuardUser } from '@modules/auth/guards/jwt-auth-user.guard';
import { RolesGuardProfessor } from '@modules/auth/guards/roles-professor.guard';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from '../controller/comments.controller';
import { CommentsService } from '../service/comments.service';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: { delete: jest.fn() },
        },
      ],
    })
      .overrideGuard(JwtAuthGuardUser)
      .useValue(mockGuard)
      .overrideGuard(RolesGuardProfessor)
      .useValue(mockGuard)
      .compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call CommentsService.delete and return its result (success)', async () => {
    const mockResult: ReturnMessageDTO = {
      statusCode: 200,
      message: systemMessage.ReturnMessage.successDeleteComment,
    };

    jest.spyOn(service, 'delete').mockResolvedValue(mockResult);

    const result = await controller.remove('uuid-123');

    expect(service.delete).toHaveBeenCalledWith('uuid-123');
    expect(result).toEqual(mockResult);
  });

  it('should return 404 message if comment not found', async () => {
    const mockResult: ReturnMessageDTO = {
      statusCode: 404,
      message: systemMessage.ReturnMessage.errorCommentNotFound,
    };

    jest.spyOn(service, 'delete').mockResolvedValue(mockResult);

    const result = await controller.remove('non-existent-id');

    expect(service.delete).toHaveBeenCalledWith('non-existent-id');
    expect(result).toEqual(mockResult);
  });
});
