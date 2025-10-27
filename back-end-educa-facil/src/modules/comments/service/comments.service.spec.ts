import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comments } from '../entities/comment.entity';
import { CommentsService } from '../service/comments.service';

describe('CommentsService', () => {
  let service: CommentsService;
  let repository: Repository<Comments>;

  const mockComment = {
    id: 'uuid-123',
    content: 'Test comment',
    createdAt: new Date(),
  } as Comments;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comments),
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    repository = module.get<Repository<Comments>>(getRepositoryToken(Comments));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if comment is not found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    const result: ReturnMessageDTO = await service.delete('non-existent-id');

    expect(result).toEqual({
      statusCode: 404,
      message: systemMessage.ReturnMessage.errorCommentNotFound,
    });
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'non-existent-id' } });
    expect(repository.remove).not.toHaveBeenCalled();
  });

  it('should delete the comment and return 200 if found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(mockComment);
    jest.spyOn(repository, 'remove').mockResolvedValue(mockComment);

    const result: ReturnMessageDTO = await service.delete('uuid-123');

    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-123' } });
    expect(repository.remove).toHaveBeenCalledWith(mockComment);
    expect(result).toEqual({
      statusCode: 200,
      message: systemMessage.ReturnMessage.successDeleteComment,
    });
  });
});
