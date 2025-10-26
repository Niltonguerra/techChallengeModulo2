import { BadRequestException } from '@nestjs/common';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { HashPasswordPipe } from './passwordEncryption.pipe';
import * as bcrypt from 'bcrypt';
import { ArgumentMetadata } from '@nestjs/common';

jest.mock('bcrypt');

describe('HashPasswordPipe', () => {
  let pipe: HashPasswordPipe;

  beforeEach(() => {
    pipe = new HashPasswordPipe();
    jest.clearAllMocks();
  });

  it('should hash the password correctly', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    const value = { password: 'senha123' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: Object,
      data: 'password',
    };
    const result = await pipe.transform(value, metadata);
    expect(result.password).toBe('hashed-password');
    expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
  });

  it('should throw error if value is not an object', async () => {
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: Object,
      data: 'password',
    };
    await expect(pipe.transform(undefined, metadata)).rejects.toThrow(BadRequestException);
    await expect(pipe.transform(undefined, metadata)).rejects.toThrow(
      'erro ao encontrar a senha, a senha deve estar contida dentro do um objeto',
    );
  });

  it('should not hash password if password is not present in value', async () => {
    const value = {};
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: Object,
      data: 'password',
    };

    const result = await pipe.transform(value, metadata);
    expect(result).toEqual({});
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it('should throw error if password is not a string', async () => {
    const value = { password: 123 };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: Object,
      data: 'password',
    };

    await expect(pipe.transform(value, metadata)).rejects.toThrow(BadRequestException);
    await expect(pipe.transform(value, metadata)).rejects.toThrow(
      systemMessage.ReturnMessage.isnotEmptyPassword,
    );
  });

  it('should throw error if password is an empty string', async () => {
    const value = { password: '' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: Object,
      data: 'password',
    };

    await expect(pipe.transform(value, metadata)).rejects.toThrow(BadRequestException);
    await expect(pipe.transform(value, metadata)).rejects.toThrow(
      systemMessage.ReturnMessage.isnotEmptyPassword,
    );
  });

  it('should throw error if password is only whitespace', async () => {
    const value = { password: '   ' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: Object,
      data: 'password',
    };

    await expect(pipe.transform(value, metadata)).rejects.toThrow(BadRequestException);
    await expect(pipe.transform(value, metadata)).rejects.toThrow(
      systemMessage.ReturnMessage.isnotEmptyPassword,
    );
  });

  it('should throw error if bcrypt.hash throws error', async () => {
    (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('hashing error'));
    const value = { password: 'senha123' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: Object,
      data: 'password',
    };

    await expect(pipe.transform(value, metadata)).rejects.toThrow(BadRequestException);
    await expect(pipe.transform(value, metadata)).rejects.toThrow(
      systemMessage.ReturnMessage.FailedToProcessPassword,
    );
  });

  it('should return the value if metadata type is not body', async () => {
    const value = { password: 'senha123' };
    const metadata: ArgumentMetadata = {
      type: 'query',
      metatype: Object,
      data: 'password',
    };
    const result = await pipe.transform(value, metadata);
    expect(result).toEqual(value);
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });
});
