import { JwtStrategyUser } from './jwt.strategy';
import { JwtPayload } from '../dtos/JwtPayload.dto';

describe('JwtStrategyUser', () => {
  let strategy: JwtStrategyUser;
  let configService: { get: jest.Mock };

  beforeEach(() => {
    configService = { get: jest.fn().mockReturnValue('test-secret') };
    strategy = new JwtStrategyUser(configService as any);
  });

  it('deve ser definido', () => {
    expect(strategy).toBeDefined();
  });

  it('deve passar as opções corretas para o super', () => {
    expect(configService.get).toHaveBeenCalledWith('JWT_SECRET', '');
  });

  it('deve validar e retornar o payload corretamente', async () => {
    const payload: JwtPayload = { email: 'user@test.com', permission: 'admin' };
    const result = await strategy.validate(payload);
    expect(result).toEqual({ email: 'user@test.com', permission: 'admin' });
  });

  it('deve funcionar com payload parcial', async () => {
    const payload = { email: 'user@test.com' } as JwtPayload;
    const result = await strategy.validate(payload);
    expect(result).toEqual({ email: 'user@test.com', permission: undefined });
  });
});
