import { CreatePostUseCase } from './createPost.usecase';
import { mockPostService, validDto, mockReturnMessage } from './__mocks__/createPost.usecase.mock';
import { HttpException, Logger } from '@nestjs/common';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { CreatePostDTO } from '../dtos/createPost.dto';

describe('CreatePostUseCase', () => {
  let useCase: CreatePostUseCase;

  beforeEach(() => {
    mockPostService.createPostService.mockReset();
    useCase = new CreatePostUseCase(mockPostService as any);
    jest.clearAllMocks();
  });

  it('deve criar um post e retornar a mensagem de sucesso', async () => {
    mockPostService.createPostService.mockResolvedValue(mockReturnMessage);
    const result = await useCase.createPostUseCase(validDto);
    expect(mockPostService.createPostService).toHaveBeenCalledWith(validDto);
    expect(result).toEqual(mockReturnMessage);
  });

  it('deve lançar HttpException se DTO for undefined', async () => {
    await expect(useCase.createPostUseCase(undefined as unknown as CreatePostDTO)).rejects.toThrow(
      HttpException,
    );
    await expect(useCase.createPostUseCase(undefined as unknown as CreatePostDTO)).rejects.toThrow(
      systemMessage.validation.isUUID,
    );
  });

  it('deve lançar HttpException e logar erro se o service lançar HttpException', async () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const customError = new HttpException('Erro customizado', 400);
    mockPostService.createPostService.mockRejectedValue(customError);
    await expect(useCase.createPostUseCase(validDto)).rejects.toThrow(HttpException);
    await expect(useCase.createPostUseCase(validDto)).rejects.toThrow('Erro customizado: 400');
    expect(loggerSpy).toHaveBeenCalledWith('Erro customizado: 400');
    loggerSpy.mockRestore();
  });

  it('deve lançar HttpException e logar erro se o service lançar erro genérico', async () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    mockPostService.createPostService.mockRejectedValue(new Error('Erro genérico'));
    await expect(useCase.createPostUseCase(validDto)).rejects.toThrow(HttpException);
    await expect(useCase.createPostUseCase(validDto)).rejects.toThrow(
      `${systemMessage.ReturnMessage.errorCreatePost}: 500`,
    );
    expect(loggerSpy).toHaveBeenCalledWith(`${systemMessage.ReturnMessage.errorCreatePost}: 500`);
    loggerSpy.mockRestore();
  });
});
