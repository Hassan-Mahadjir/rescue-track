import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { VerifyCallback } from 'passport-oauth2';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';
import microsoftOauthConfig from '../config/microsoft-oauth.config';
import { Gender } from 'src/enums/gender.enums';
import { Nationality } from 'src/enums/nationality.enums';

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
        avatar: profile._json.mobilePhone || null,
        middleName: profile._json.mobilePhone || null,
        address: profile._json.mobilePhone || null,
        phone: profile._json.mobilePhone || null,
        nationality: profile._json.mobilePhone || null,
        gender: profile._json.mobilePhone || null,
        dateofBirth: profile._json.birthdate || null,
      },
    );

    // return user;
    console.log({ profile });
    done(null, user);
  }
}
