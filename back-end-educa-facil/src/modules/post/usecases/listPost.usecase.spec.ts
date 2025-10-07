import { systemMessage } from '@config/i18n/pt/systemMessage';
import { HttpStatus, Logger } from '@nestjs/common';
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
    expect(mockPostService.listPosts).toHaveBeenCalledWith({ offset: '0', limit: '10' });
    expect(result).toEqual(mockListPostData);
    expect(Array.isArray(result.ListPost)).toBe(true);
    if (Array.isArray(result.ListPost)) {
      expect(result.ListPost[0].title).toBe('Post 1');
    }
  });

  it('deve retornar objeto de erro e logar erro se o service lançar erro genérico', async () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    mockPostService.listPosts.mockRejectedValue(new Error('Erro genérico'));

    const result = await useCase.execute({ offset: '0', limit: '10' });

    expect(result).toEqual(
      expect.objectContaining({
        message: systemMessage.ReturnMessage.errorGetPosts,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        limit: 10,
        offset: 0,
        total: 0,
        ListPost: [],
      }),
    );

    expect(loggerSpy).toHaveBeenCalledWith('Erro em listPosts:', expect.any(Error));
    loggerSpy.mockRestore();
  });
});
