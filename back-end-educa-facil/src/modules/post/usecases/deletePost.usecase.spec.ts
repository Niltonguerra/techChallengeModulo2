import { DeletePostUseCase } from './deletePost.usecase';
import { HttpException, Logger } from '@nestjs/common';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { systemMessage } from '@config/i18n/pt/systemMessage';

describe('DeletePostUseCase', () => {
  let useCase: DeletePostUseCase;
  let mockPostService: { deletePostService: jest.Mock };

  beforeEach(() => {
    mockPostService = {
      deletePostService: jest.fn(),
    };
    useCase = new DeletePostUseCase(mockPostService as any);
    jest.clearAllMocks();
  });

  it('deve deletar um post com sucesso', async () => {
    const returnMessage: ReturnMessageDTO = {
      message: 'Post deletado com sucesso',
      statusCode: 200,
    };
    mockPostService.deletePostService.mockResolvedValue(returnMessage);
    const result = await useCase.deletePostUseCase('post123');
    expect(mockPostService.deletePostService).toHaveBeenCalledWith('post123');
    expect(result).toEqual(returnMessage);
  });

  it('deve lançar HttpException e logar erro se o service lançar HttpException', async () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const customError = new HttpException('Erro customizado', 404);
    mockPostService.deletePostService.mockRejectedValue(customError);
    await expect(useCase.deletePostUseCase('post123')).rejects.toThrow(HttpException);
    await expect(useCase.deletePostUseCase('post123')).rejects.toThrow('Erro customizado: 404');
    expect(loggerSpy).toHaveBeenCalledWith('Erro customizado: 404');
    loggerSpy.mockRestore();
  });

  it('deve lançar HttpException e logar erro se o service lançar erro genérico', async () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    mockPostService.deletePostService.mockRejectedValue(new Error('Erro genérico'));
    await expect(useCase.deletePostUseCase('post123')).rejects.toThrow(HttpException);
    await expect(useCase.deletePostUseCase('post123')).rejects.toThrow(
      `${systemMessage.ReturnMessage.errorDeletePost}: 500`,
    );
    expect(loggerSpy).toHaveBeenCalledWith(`${systemMessage.ReturnMessage.errorDeletePost}: 500`);
    loggerSpy.mockRestore();
  });
});
