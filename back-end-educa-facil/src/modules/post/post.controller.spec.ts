import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { CreatePostUseCase } from './usecases/createPost.usecase';
import { listPostUseCase } from './usecases/listPost.usecase';
import { UpdatePostUseCase } from './usecases/updatePost.usecase';
import { GetPostUseCase } from './usecases/getPost.usecase';
import { CreatePostDTO } from './dtos/createPost.dto';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { UpdatePostDTO } from './dtos/updatePost.dto';
import { ListPostDTO } from './dtos/listPost.dto';
import { GetPostDTO } from './dtos/getPostService.dto';
import { CreatePostDTO } from './dtos/createPost.dto';
import { UpdatePostDTO } from './DTOs/updatePost.DTO';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { GetPostDTO } from './DTOs/getPost.DTO';
import { JwtService } from '@nestjs/jwt';

describe('PostController', () => {
  let controller: PostController;

  const mockCreatePostUseCase = {
    createPostUseCase: jest.fn(),
  };

  const mockListPostUseCase = {
    execute: jest.fn(),
  };

  const mockUpdatePostUseCase = {
    UpdatePostUseCase: jest.fn(),
  };

  const mockGetPostUseCase = {
    getPostUseCaseById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        { provide: CreatePostUseCase, useValue: mockCreatePostUseCase },
        { provide: listPostUseCase, useValue: mockListPostUseCase },
        { provide: UpdatePostUseCase, useValue: mockUpdatePostUseCase },
        { provide: GetPostUseCase, useValue: mockGetPostUseCase },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('deve criar um post', async () => {
    const dto: CreatePostDTO = {
      title: 'Post Teste',
      description: 'Descrição do post',
      author_id: '123',
      image: '',
      search_field: [],
      scheduled_publication: '',
      content_hashtags: [],
      style_id: '',
    };

    const expected: ReturnMessageDTO = {
      message: 'Post criado com sucesso',
      statusCode: 200,
    };

    mockCreatePostUseCase.createPostUseCase.mockResolvedValue(expected);

    const result = await controller.CreatePost(dto);

    expect(mockCreatePostUseCase.createPostUseCase).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('deve listar os posts', async () => {
    const query: ListPostDTO = { search: '', offset: 0, limit: 10 };
    const expectedPosts = [
      { id: '1', title: 'Post 1' },
      { id: '2', title: 'Post 2' },
    ];

    mockListPostUseCase.execute.mockResolvedValue(expectedPosts);

    const result = await controller.listPosts(query);

    expect(mockListPostUseCase.execute).toHaveBeenCalledWith(query);
    expect(result).toEqual(expectedPosts);
  });

  it('deve atualizar um post', async () => {
    const dto: UpdatePostDTO = {
      id: '1',
      title: 'Novo Título',
      description: 'Nova descrição',
    };

    const expected: ReturnMessageDTO = {
      message: 'Post atualizado com sucesso',
      statusCode: 200,
    };

    mockUpdatePostUseCase.UpdatePostUseCase.mockResolvedValue(expected);

    const result = await controller.UpdatePost(dto);

    expect(mockUpdatePostUseCase.UpdatePostUseCase).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('deve buscar um post por ID', async () => {
    const id = '1';
    const expected: GetPostDTO = {
      title: 'Post 1',
      description: 'Desc',
      image: '',
      search: '',
      content_hashtags: [],
      style_id: '',
      external_link: { url: 'https://example.com' },
      created_at: new Date(),
      updated_at: new Date(),
      id: '',
    };

    mockGetPostUseCase.getPostUseCaseById.mockResolvedValue(expected);

    const result = await controller.getById(id);

    expect(mockGetPostUseCase.getPostUseCaseById).toHaveBeenCalledWith(id);
    expect(result).toEqual(expected);
  });
});
