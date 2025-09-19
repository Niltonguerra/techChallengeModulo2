import { systemMessage } from '@config/i18n/pt/systemMessage';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { GetUniqueHashtagsUseCase } from './getUniqueHashtags.usecase';

describe('GetUniqueHashtagsUseCase', () => {
  let useCase: GetUniqueHashtagsUseCase;
  let mockPostService: { getUniqueHashtags: jest.Mock };

  beforeEach(() => {
    mockPostService = {
      getUniqueHashtags: jest.fn(),
    };
    useCase = new GetUniqueHashtagsUseCase(mockPostService as any);
    jest.clearAllMocks();
  });

  it('deve retornar a lista de hashtags únicas', async () => {
    const mockHashtags = ['#nestjs', '#typescript', '#nodejs'];
    mockPostService.getUniqueHashtags.mockResolvedValue(mockHashtags);

    const result = await useCase.execute();

    expect(mockPostService.getUniqueHashtags).toHaveBeenCalled();
    expect(result).toEqual(mockHashtags);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeLessThanOrEqual(10);
    if (result.length > 0) {
      expect(typeof result[0]).toBe('string');
    }
  });

  it('deve lançar HttpException e logar erro se o service lançar HttpException', async () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const customError = new HttpException('Erro customizado', 404);

    mockPostService.getUniqueHashtags.mockRejectedValue(customError);

    await expect(useCase.execute()).rejects.toThrow(HttpException);
    await expect(useCase.execute()).rejects.toThrow('Erro customizado');
    expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Erro customizado: 404'));

    loggerSpy.mockRestore();
  });

  it('deve lançar HttpException e logar erro se o service lançar erro genérico', async () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

    mockPostService.getUniqueHashtags.mockRejectedValue(new Error('Erro genérico'));

    await expect(useCase.execute()).rejects.toThrow(HttpException);
    await expect(useCase.execute()).rejects.toThrow(
      `${systemMessage.ReturnMessage.errorGetPosts}: ${HttpStatus.INTERNAL_SERVER_ERROR}`,
    );
    expect(loggerSpy).toHaveBeenCalledWith(
      `${systemMessage.ReturnMessage.errorGetPosts}: ${HttpStatus.INTERNAL_SERVER_ERROR}`,
    );

    loggerSpy.mockRestore();
  });
});
