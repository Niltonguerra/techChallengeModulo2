import { JwtAuthGuardUser } from './jwt-auth-user.guard';

describe('JwtAuthGuardUser', () => {
  it('deve ser definido', () => {
    const guard = new JwtAuthGuardUser();
    expect(guard).toBeDefined();
  });

  it('deve ser uma subclasse de AuthGuard', () => {
    const guard = new JwtAuthGuardUser();
    expect(guard.constructor.name).toContain('AuthGuard');
  });
});
