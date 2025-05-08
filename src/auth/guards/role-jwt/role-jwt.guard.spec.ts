import { RoleJwtGuard } from './role-jwt.guard';

describe('RoleJwtGuard', () => {
  it('should be defined', () => {
    expect(new RoleJwtGuard()).toBeDefined();
  });
});
