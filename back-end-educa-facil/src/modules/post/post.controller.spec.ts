import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { CreatePostUseCase } from './usecases/createPost.usecase';
import { UpdatePostUseCase } from './usecases/updatePost.usecase';
import { GetPostUseCase } from './usecases/getPost.usecase';
import { CreatePostDTO } from './dtos/createPost.DTO';
import { UpdatePostDTO } from './DTOs/updatePost.DTO';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { GetPostDTO } from './DTOs/getPost.DTO';

describe('PostController', () => {
  let controller: PostController;
  let createPostUseCase: { createPostUseCase: jest.Mock };
  let updatePostUseCase: { UpdatePostUseCase: jest.Mock };
  let getPostUseCase: { getPostUseCaseById: jest.Mock };

  beforeEach(async () => {
    createPostUseCase = { createPostUseCase: jest.fn() };
    updatePostUseCase = { UpdatePostUseCase: jest.fn() };
    getPostUseCase = { getPostUseCaseById: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        { provide: CreatePostUseCase, useValue: createPostUseCase },
        { provide: UpdatePostUseCase, useValue: updatePostUseCase },
        { provide: GetPostUseCase, useValue: getPostUseCase },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('deve criar um post e retornar a mensagem de sucesso', async () => {
    const dto: CreatePostDTO = {
      title: 'Título',
      description: 'Desc',
      author_id: '1',
      image: '',
      search_field: [],
      scheduled_publication: '',
      content_hashtags: [],
      style_id: '',
    };
    const returnMessage: ReturnMessageDTO = { message: 'Post criado com sucesso', statusCode: 200 };
    createPostUseCase.createPostUseCase.mockResolvedValue(returnMessage);
    const result = await controller.CreatePost(dto);
    expect(createPostUseCase.createPostUseCase).toHaveBeenCalledWith(dto);
    expect(result).toEqual(returnMessage);
  });

  it('deve atualizar um post e retornar a mensagem de sucesso', async () => {
    const dto: UpdatePostDTO = {
      id: '1',
      title: 'Novo título',
      description: 'Nova descrição',
    };
    const returnMessage: ReturnMessageDTO = {
      message: 'Post atualizado com sucesso',
      statusCode: 200,
    };
    updatePostUseCase.UpdatePostUseCase.mockResolvedValue(returnMessage);
    const result = await controller.UpdatePost(dto);
    expect(updatePostUseCase.UpdatePostUseCase).toHaveBeenCalledWith(dto);
    expect(result).toEqual(returnMessage);
  });

  it('deve buscar um post por id', async () => {
    const id = '1';
    const posts: GetPostDTO[] = [
      {
        title: 'Título',
        description: 'Descrição',
        image: '',
        search_field: [],
        content_hashtags: [],
        style_id: '',
        external_link: { url: 'https://example.com' },
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    getPostUseCase.getPostUseCaseById.mockResolvedValue(posts);
    const result = await controller.getById(id);
    expect(getPostUseCase.getPostUseCaseById).toHaveBeenCalledWith(id);
    expect(result).toEqual(posts);
  });
});
