import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import { Inject, Injectable } from '@nestjs/common';
import refreshJwtConfig from '../config/refresh-jwt.config';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private refreshjwtConfiguration: ConfigType<typeof refreshJwtConfig>,
  ) {
    super({
      // Extract the JWT from the Authorization header & verify the signature
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshjwtConfiguration.secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: AuthJwtPayload) {
    return { id: payload.sub };
  }
}
