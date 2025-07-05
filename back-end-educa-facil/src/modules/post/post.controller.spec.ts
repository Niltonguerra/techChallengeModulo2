import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { createPostUseCase } from './usecases/createPost.usecase';
import { GetPostUseCase } from './usecases/getPost.usecase';
import { CreatePostDTO } from './DTOs/createPost.DTO';
import { CreateReturnMessageDTO } from './DTOs/returnMessage.DTO';
import { GetPostDTO } from './DTOs/getPost.DTO';

describe('PostController', () => {
  let controller: PostController;

  const mockCreatePostUseCase = {
    createPostUseCase: jest.fn(),
  };

  const mockGetPostUseCase = {
    getPostUseCaseById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: createPostUseCase,
          useValue: mockCreatePostUseCase,
        },
        {
          provide: GetPostUseCase,
          useValue: mockGetPostUseCase,
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    jest.clearAllMocks();
  });

  describe('CreatePost', () => {
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

    const successResponse: CreateReturnMessageDTO = {
      message: 'Post criado com sucesso',
      statusCode: 200,
    };

    it('should call use case and return success message', async () => {
      mockCreatePostUseCase.createPostUseCase.mockResolvedValue(successResponse);

      const result = await controller.CreatePost(dto);

      expect(mockCreatePostUseCase.createPostUseCase).toHaveBeenCalledWith(dto);
      expect(result).toEqual(successResponse);
    });

    it('should propagate errors from the use case', async () => {
      const error = new Error('Falha ao criar post');
      mockCreatePostUseCase.createPostUseCase.mockRejectedValue(error);

      await expect(controller.CreatePost(dto)).rejects.toThrow(error);
      expect(mockCreatePostUseCase.createPostUseCase).toHaveBeenCalledWith(dto);
    });
  });

  describe('getById', () => {
    const id = 'post123';
    const posts: GetPostDTO[] = [
      {
      title: 'Título',
      description: 'Descrição',
      external_link: {
        instagram: 'https://instagram.com/exemplo',
        youtube: 'https://youtube.com/exemplo',
        tiktok: 'https://tiktok.com/@exemplo',
      },
      search_field: ['arra'],
      introduction: 'fjojoga gelfjrd',
      content_hashtags: ['#supera'],
      style_id: 'feijfo4t9wrrwifb314',
      image: 'https://i.pinimg.com/736x/54/f9/25/54f925d3aeeefa1405dea76357f00da2.jpg',
      created_at: new Date('2025-04-01'),
      updated_at: new Date('2025-04-16'),
      author_name: 'Lira da Silva',
      author_email: 'ls@gmail.com',
    }
    ];

    it('should call use case and return array of posts', async () => {
      mockGetPostUseCase.getPostUseCaseById.mockResolvedValue(posts);

      const result = await controller.getById(id);

      expect(mockGetPostUseCase.getPostUseCaseById).toHaveBeenCalledWith(id);
      expect(result).toEqual(posts);
    });

    it('should propagate errors from the use case', async () => {
      const error = new Error('Falha ao buscar post');
      mockGetPostUseCase.getPostUseCaseById.mockRejectedValue(error);

      await expect(controller.getById(id)).rejects.toThrow(error);
      expect(mockGetPostUseCase.getPostUseCaseById).toHaveBeenCalledWith(id);
    });
  });
});