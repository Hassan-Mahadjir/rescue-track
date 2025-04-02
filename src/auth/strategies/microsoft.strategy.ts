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
    console.log({ profile });
    const user = await this.authService.validateGoogleUser(
      {
        email: profile.userPrincipalName,
        password: '',
      },
      {
        // ._JSON.jobTitle is just for testing purpose
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        avatar: profile.photos[0]?.value || '',
        middleName: profile._json.jobTitle || null,
        address: profile.address || null,
        phone: profile._json.mobilePhone || null,
        nationality: profile._json.mobilePhone || null,
        gender: profile._json.jobTitle || null,
        dateofBirth: profile._josn.jobTitle || null,
      },
    );

    // return user;
    console.log({ profile });
    done(null, user);
  }
}
