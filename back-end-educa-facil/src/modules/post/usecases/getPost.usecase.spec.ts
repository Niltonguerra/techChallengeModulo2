import { GetPostUseCase } from './getPost.usecase';
import { HttpException, Logger } from '@nestjs/common';
import { mockPostService, postMock } from './__mocks__/getPost.usecase.mock';
import { systemMessage } from '@config/i18n/pt/systemMessage';

describe('GetPostUseCase', () => {
  let useCase: GetPostUseCase;

  beforeEach(() => {
    mockPostService.getById.mockReset();
    useCase = new GetPostUseCase(mockPostService as any);
    jest.clearAllMocks();
  });

  it('deve retornar um post quando encontrado pelo ID', async () => {
    mockPostService.getById.mockResolvedValue(postMock);
    const result = await useCase.getPostUseCaseById('id123');
    expect(mockPostService.getById).toHaveBeenCalledWith('id123');
    expect(result).toEqual(postMock);
  });

  it('deve lançar HttpException e logar erro se o service lançar HttpException', async () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const customError = new HttpException('Erro customizado', 404);
    mockPostService.getById.mockRejectedValue(customError);
    await expect(useCase.getPostUseCaseById('id123')).rejects.toThrow(HttpException);
    await expect(useCase.getPostUseCaseById('id123')).rejects.toThrow('Erro customizado: 404');
    expect(loggerSpy).toHaveBeenCalledWith('Erro customizado: 404');
    loggerSpy.mockRestore();
  });

  it('deve lançar HttpException e logar erro se o service lançar erro genérico', async () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    mockPostService.getById.mockRejectedValue(new Error('Erro genérico'));
    await expect(useCase.getPostUseCaseById('id123')).rejects.toThrow(HttpException);
    await expect(useCase.getPostUseCaseById('id123')).rejects.toThrow(
      `${systemMessage.ReturnMessage.errorGetPostById}: 500`,
    );
    expect(loggerSpy).toHaveBeenCalledWith(`${systemMessage.ReturnMessage.errorGetPostById}: 500`);
    loggerSpy.mockRestore();
  });
});
