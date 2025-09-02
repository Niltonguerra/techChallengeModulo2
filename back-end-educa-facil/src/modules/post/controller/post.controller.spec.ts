import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostUseCase } from '../usecases/createPost.usecase';
import { DeletePostUseCase } from '../usecases/deletePost.usecase';
import { GetPostUseCase } from '../usecases/getPost.usecase';
import { ListPostUseCase } from '../usecases/listPost.usecase';
import { UpdatePostUseCase } from '../usecases/updatePost.usecase';
import {
  createPostDTOMock,
  jwtPayloadMock,
  listPostDTOMock,
  returnListPostMock,
  returnMessageCreateMock,
  returnMessageDeleteMock,
  returnMessageUpdateMock,
  updatePostDTOMock,
} from './__mocks__/post-controller.mock';
import { PostController } from './post.controller';

describe('PostController', () => {
  let controller: PostController;
  let mockListPostUseCase: { execute: jest.Mock };
  let mockCreatePostUseCase: { createPostUseCase: jest.Mock };
  let mockUpdatePostUseCase: { execute: jest.Mock };
  let mockGetPostUseCase: { getPostUseCaseById: jest.Mock };
  let mockDeletePostUseCase: { deletePostUseCase: jest.Mock };

  beforeEach(async () => {
    mockListPostUseCase = { execute: jest.fn() };
    mockCreatePostUseCase = { createPostUseCase: jest.fn() };
    mockUpdatePostUseCase = { execute: jest.fn() };
    mockGetPostUseCase = { getPostUseCaseById: jest.fn() };
    mockDeletePostUseCase = { deletePostUseCase: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        { provide: ListPostUseCase, useValue: mockListPostUseCase },
        { provide: CreatePostUseCase, useValue: mockCreatePostUseCase },
        { provide: UpdatePostUseCase, useValue: mockUpdatePostUseCase },
        { provide: GetPostUseCase, useValue: mockGetPostUseCase },
        { provide: DeletePostUseCase, useValue: mockDeletePostUseCase },
        { provide: JwtService, useValue: { verify: jest.fn(), sign: jest.fn() } }, // <-- CORREÇÃO AQUI
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve listar posts', async () => {
    mockListPostUseCase.execute.mockResolvedValue(returnListPostMock);
    const result = await controller.listPosts(listPostDTOMock);
    expect(result).toBe(returnListPostMock);
    expect(mockListPostUseCase.execute).toHaveBeenCalledWith(listPostDTOMock);
  });

  it('deve buscar um post por ID', async () => {
    mockGetPostUseCase.getPostUseCaseById.mockResolvedValue(returnListPostMock);
    const result = await controller.getById('abc123');
    expect(result).toBe(returnListPostMock);
    expect(mockGetPostUseCase.getPostUseCaseById).toHaveBeenCalledWith('abc123');
  });

  it('deve criar um post', async () => {
    mockCreatePostUseCase.createPostUseCase.mockResolvedValue(returnMessageCreateMock);

    const postData = { ...createPostDTOMock };
    const result = await controller.createPost(postData, jwtPayloadMock);

    expect(postData.user_id).toEqual(jwtPayloadMock.id);
    expect(result).toBe(returnMessageCreateMock);
    expect(mockCreatePostUseCase.createPostUseCase).toHaveBeenCalledWith(postData);
  });

  it('deve atualizar um post', async () => {
    mockUpdatePostUseCase.execute.mockResolvedValue(returnMessageUpdateMock);
    const result = await controller.updatePost(updatePostDTOMock);
    expect(result).toBe(returnMessageUpdateMock);
    expect(mockUpdatePostUseCase.execute).toHaveBeenCalledWith(updatePostDTOMock);
  });

  it('deve deletar um post', async () => {
    mockDeletePostUseCase.deletePostUseCase.mockResolvedValue(returnMessageDeleteMock);
    const result = await controller.deletePost('abc123');
    expect(result).toBe(returnMessageDeleteMock);
    expect(mockDeletePostUseCase.deletePostUseCase).toHaveBeenCalledWith('abc123');
  });
});
