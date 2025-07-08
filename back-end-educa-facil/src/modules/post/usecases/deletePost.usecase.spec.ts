// delete-post.usecase.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PostService } from '../post.service';
import { DeleteReturnMessageDTO } from '../DTOs/returnMessage.DTO';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { DeletePostUseCase } from './deletePost.usecase';

describe('deletePostUseCase', () => {
  let useCase: DeletePostUseCase;
  let postService: Partial<Record<'deletePostService', jest.Mock>>;

  beforeEach(async () => {
    postService = {
      deletePostService: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [DeletePostUseCase, { provide: PostService, useValue: postService }],
    }).compile();

    useCase = module.get(DeletePostUseCase);
    jest.clearAllMocks();
  });

  it('deve retornar o DTO de sucesso quando postService.deletePostService resolver', async () => {
    const retorno: DeleteReturnMessageDTO = {
      message: systemMessage.ReturnMessage.sucessDeletePost,
      statusCode: 200,
    };
    postService.deletePostService!.mockResolvedValue(retorno);

    const result = await useCase.deletePostUseCase('qualquer-id');

    expect(postService.deletePostService).toHaveBeenCalledWith('qualquer-id');
    expect(result).toEqual(retorno);
  });

  it('deve lançar HttpException com a mensagem de Error.message quando postService lançar Error', async () => {
    const err = new Error('falha qualquer');
    postService.deletePostService!.mockRejectedValue(err);
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(useCase.deletePostUseCase('id-errado')).rejects.toMatchObject({
      response: `Erro ao criar o post: ${err.message}`,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    } as unknown as HttpException);

    expect(console.error).toHaveBeenCalledWith(err);
  });

  it('deve lançar HttpException com mensagem genérica quando postService lançar algo que não seja Error', async () => {
    const nonError = { reason: 'motivo X' };
    postService.deletePostService!.mockRejectedValue(nonError);
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(useCase.deletePostUseCase('id-qualquer')).rejects.toMatchObject({
      response: `Erro ao criar o post: ${systemMessage.ReturnMessage.errorDeletePost}`,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    } as unknown as HttpException);

    expect(console.error).toHaveBeenCalledWith(nonError);
  });
});