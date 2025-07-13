import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { CreatePostDTO } from './dtos/createPost.DTO';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { CreatePostUseCase } from './usecases/createPost.usecase';

describe('PostController', () => {
  let controller: PostController;

  const mockCreatePostUseCase = {
    createPostUseCase: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: CreatePostUseCase,
          useValue: mockCreatePostUseCase,
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    controller = module.get<PostController>(PostController);
    jest.clearAllMocks();
  });

  it('deve criar um post e retornar a mensagem de sucesso', async () => {
    const dto: CreatePostDTO = {
      title: 'Título',
      description: 'Descrição',
      author_id: 'autor123',
      image: 'imagem.jpg',
      search_field: [],
      scheduled_publication: '',
      content_hashtags: [],
      style_id: '',
    };

    const returnMessage: ReturnMessageDTO = {
      message: 'Post criado com sucesso',
      statusCode: 200,
    };

    mockCreatePostUseCase.createPostUseCase.mockResolvedValue(returnMessage);

    const result = await controller.CreatePost(dto);

    expect(mockCreatePostUseCase.createPostUseCase).toHaveBeenCalledWith(dto);
    expect(result).toEqual(returnMessage);
  });
});
