import { UpdatePostUseCase } from './updatePost.usecase';
import {
  mockPostService,
  mockUpdatePostDto,
  mockReturnMessage,
} from './__mocks__/updatePost.usecase.mock';
import { HttpException, Logger } from '@nestjs/common';
import { systemMessage } from '@config/i18n/pt/systemMessage';

describe('UpdatePostUseCase', () => {
  let useCase: UpdatePostUseCase;

  beforeEach(() => {
    mockPostService.UpdatePostService.mockReset();
    useCase = new UpdatePostUseCase(mockPostService as any);
    jest.clearAllMocks();
  });

  it('deve atualizar um post e retornar a mensagem de sucesso', async () => {
    mockPostService.UpdatePostService.mockResolvedValue(mockReturnMessage);
    const result = await useCase.UpdatePostUseCase(mockUpdatePostDto);
    expect(mockPostService.UpdatePostService).toHaveBeenCalledWith(mockUpdatePostDto);
    expect(result).toEqual(mockReturnMessage);
  });

  it('deve lançar HttpException e logar erro se o service lançar HttpException', async () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const customError = new HttpException('Erro customizado', 404);
    mockPostService.UpdatePostService.mockRejectedValue(customError);
    await expect(useCase.UpdatePostUseCase(mockUpdatePostDto)).rejects.toThrow(HttpException);
    await expect(useCase.UpdatePostUseCase(mockUpdatePostDto)).rejects.toThrow(
      'Erro customizado: 404',
    );
    expect(loggerSpy).toHaveBeenCalledWith('Erro customizado: 404');
    loggerSpy.mockRestore();
  });

  it('deve lançar HttpException e logar erro se o service lançar erro genérico', async () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    mockPostService.UpdatePostService.mockRejectedValue(new Error('Falha ao atualizar'));
    await expect(useCase.UpdatePostUseCase(mockUpdatePostDto)).rejects.toThrow(HttpException);
    await expect(useCase.UpdatePostUseCase(mockUpdatePostDto)).rejects.toThrow(
      `${systemMessage.ReturnMessage.errorUpdatePost}: 500`,
    );
    expect(loggerSpy).toHaveBeenCalledWith(`${systemMessage.ReturnMessage.errorUpdatePost}: 500`);
    loggerSpy.mockRestore();
  });
});
