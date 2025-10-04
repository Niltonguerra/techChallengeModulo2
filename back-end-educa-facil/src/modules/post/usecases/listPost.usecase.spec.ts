import { systemMessage } from '@config/i18n/pt/systemMessage';
import { HttpException, Logger } from '@nestjs/common';
import { mockListPostData, mockPostService } from './__mocks__/listPost.usecase.mock';
import { ListPostUseCase } from './listPost.usecase';

describe('ListPostUseCase', () => {
  let useCase: ListPostUseCase;

  beforeEach(() => {
    mockPostService.listPosts.mockReset();
    useCase = new ListPostUseCase(mockPostService as any);
    jest.clearAllMocks();
  });

  it('deve retornar a lista de posts com os campos esperados', async () => {
    mockPostService.listPosts.mockResolvedValue(mockListPostData);
    const result = await useCase.execute({ offset: '0', limit: '10' });
    expect(mockPostService.listPosts).toHaveBeenCalledWith({ offset: 0, limit: 10 });
    expect(result).toEqual(mockListPostData);
    expect(Array.isArray(result.ListPost)).toBe(true);
    if (Array.isArray(result.ListPost)) {
      expect(result.ListPost[0].title).toBe('Post 1');
    }
  });

  it('deve lançar HttpException e logar erro se o service lançar HttpException', async () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const customError = new HttpException('Erro customizado', 404);
    mockPostService.listPosts.mockRejectedValue(customError);
    await expect(useCase.execute({ offset: '0', limit: '10' })).rejects.toThrow(HttpException);
    await expect(useCase.execute({ offset: '0', limit: '10' })).rejects.toThrow(
      'Erro customizado: 404',
    );
    expect(loggerSpy).toHaveBeenCalledWith('Erro customizado: 404');
    loggerSpy.mockRestore();
  });

  it('deve lançar HttpException e logar erro se o service lançar erro genérico', async () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    mockPostService.listPosts.mockRejectedValue(new Error('Erro genérico'));
    await expect(useCase.execute({ offset: '0', limit: '10' })).rejects.toThrow(HttpException);
    await expect(useCase.execute({ offset: '0', limit: '10' })).rejects.toThrow(
      `${systemMessage.ReturnMessage.errorGetPosts}: 500`,
    );
    expect(loggerSpy).toHaveBeenCalledWith(`${systemMessage.ReturnMessage.errorGetPosts}: 500`);
    loggerSpy.mockRestore();
  });
});
