import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePostUseCase } from './updatePost.usecase';
import { PostService } from '../post.service';
import { UpdatePostDTO } from '../DTOs/updatePost.DTO';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { HttpException } from '@nestjs/common';

describe('UpdatePostUseCase', () => {
  let useCase: UpdatePostUseCase;
  let postService: { UpdatePostService: jest.Mock };

  beforeEach(async () => {
    postService = {
      UpdatePostService: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdatePostUseCase, { provide: PostService, useValue: postService }],
    }).compile();

    useCase = module.get(UpdatePostUseCase);
  });

  it('deve atualizar um post e retornar a mensagem de sucesso', async () => {
    const dto: UpdatePostDTO = {
      id: '1',
      title: 'Novo título',
      description: '',
    };
    const returnMessage: ReturnMessageDTO = {
      message: 'Post atualizado com sucesso',
      statusCode: 200,
    };
    postService.UpdatePostService.mockResolvedValue(returnMessage);

    const result = await useCase.UpdatePostUseCase(dto);
    expect(postService.UpdatePostService).toHaveBeenCalledWith(dto);
    expect(result).toEqual(returnMessage);
  });

  it('deve lançar HttpException em caso de erro', async () => {
    const dto: UpdatePostDTO = {
      id: '1',
      title: 'Novo título',
      description: '',
    };
    postService.UpdatePostService.mockRejectedValue(new Error('Falha ao atualizar'));

    await expect(useCase.UpdatePostUseCase(dto)).rejects.toThrow(HttpException);
    await expect(useCase.UpdatePostUseCase(dto)).rejects.toThrow(
      'Erro ao criar o post: Falha ao atualizar',
    );
  });
});
