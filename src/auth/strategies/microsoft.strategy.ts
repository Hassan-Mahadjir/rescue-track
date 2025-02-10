import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { VerifyCallback } from 'passport-oauth2';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';
import microsoftOauthConfig from '../config/microsoft-oauth.config';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(microsoftOauthConfig.KEY)
    private microsoftConfiguration: ConfigType<typeof microsoftOauthConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: microsoftConfiguration.clientId,
      clientSecret: microsoftConfiguration.clientSecret,
      callbackURL: microsoftConfiguration.callbackURL,
      scope: ['user.read'],
      tenant: 'common',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const user = await this.authService.validateGoogleUser({
      email: profile.userPrincipalName,
      password: '',
    });

    // return user;
    console.log({ profile });
    done(null, user);
  }
}
