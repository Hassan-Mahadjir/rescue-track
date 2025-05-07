import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string, isAdmin: boolean) {
    if (password === '')
      throw new UnauthorizedException(
        'Password is required. Please provide a password.',
      );

    return this.authService.validateUser(email, password, isAdmin);
  }
}
