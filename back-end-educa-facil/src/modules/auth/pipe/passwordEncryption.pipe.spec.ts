import { HashPasswordPipe } from './passwordEncryption.pipe';
import { BadRequestException } from '@nestjs/common';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('HashPasswordPipe', () => {
  it('deve lançar erro se password for apenas espaços em branco', async () => {
    await expect(pipe.transform({ password: '    ' })).rejects.toThrow(BadRequestException);
    await expect(pipe.transform({ password: '    ' })).rejects.toThrow(
      systemMessage.ReturnMessage.isnotEmptyPassword,
    );
  });
  let pipe: HashPasswordPipe;

  beforeEach(() => {
    pipe = new HashPasswordPipe();
    jest.clearAllMocks();
  });

  it('deve hashear a senha corretamente', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    const result = await pipe.transform({ password: 'senha123' });
    expect(result.password).toBe('hashed-password');
  });

  it('deve lançar erro se value não for objeto', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await expect(pipe.transform(undefined as any)).rejects.toThrow(BadRequestException);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await expect(pipe.transform(undefined as any)).rejects.toThrow(
      systemMessage.ReturnMessage.isObject,
    );
  });

  it('deve lançar erro se password não for string', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await expect(pipe.transform({ password: 123 } as any)).rejects.toThrow(BadRequestException);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await expect(pipe.transform({ password: 123 } as any)).rejects.toThrow(
      systemMessage.ReturnMessage.isnotEmptyPassword,
    );
  });

  it('deve lançar erro se password for string vazia', async () => {
    await expect(pipe.transform({ password: '' })).rejects.toThrow(BadRequestException);
    await expect(pipe.transform({ password: '' })).rejects.toThrow(
      systemMessage.ReturnMessage.isnotEmptyPassword,
    );
  });

  it('deve lançar erro se bcrypt.hash lançar erro', async () => {
    (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('erro'));
    await expect(pipe.transform({ password: 'senha123' })).rejects.toThrow(BadRequestException);
    await expect(pipe.transform({ password: 'senha123' })).rejects.toThrow(
      systemMessage.ReturnMessage.FailedToProcessPassword,
    );
  });
});
