import { registerAs } from '@nestjs/config';

export default registerAs('microsoftOAuth', () => ({
  clientId: process.env.MICOROSOFT_APPLICATION_ID ?? '',
  clientSecret: process.env.MICOROSOFT_CLIENT_SECRET ?? '',
  callbackURL: process.env.MICOROSOFT_CALLBACK_URL,
}));
