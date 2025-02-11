import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2';
import { CurrentUser } from './types/current-user';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException('User not found!');

    const isPasswordMatch = await argon2.verify(user.password, password);
    if (!isPasswordMatch)
      throw new UnauthorizedException(
        'Invalid credentials!(password is incorrect)',
      );

    // Return the user id if the user is found and the password is correct
    return { id: user.id };
  }

  async login(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return {
      message: 'Login Successfully.',
      data: { id: userId, accessToken, refreshToken },
    };
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshJwtConfiguration),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshToken(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return { id: userId, accessToken, refreshToken };
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);

    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    const refreshTokenMatches = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches)
      throw new UnauthorizedException('Invalid refresh token');

    return { id: user.id };
  }

  async logout(userId: number) {
    await this.userService.updateHashedRefreshToken(userId, null);
  }

  async validateJwtUser(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found!');
    }

    const currentUser: CurrentUser = { id: user.id, role: user.role };
    return currentUser;
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);
    if (!user) return await this.userService.create(googleUser);

    return user;
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userService.findOne(userId);
    if (!user)
      throw new NotFoundException(`User with ID: ${userId} not found!`);

    const isPasswordMatch = await argon2.verify(user.password, oldPassword);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid credentials!');

    const newHashedPassword = await argon2.hash(newPassword);
    return this.userService.updateHashedPassword(userId, newHashedPassword);
  }

  async forgetPassword(email: string, newPassword: string) {
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new NotFoundException(`User with email: ${email} not found!`);

    const newHashedPassword = await argon2.hash(newPassword);

    user.password = newHashedPassword;

    await this.userService.update(user.id, { password: newHashedPassword });

    return { message: 'Password has been successfully reset.' };
  }

  async sendCodeEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new NotFoundException(`User with email: ${email} not found!`);

    if (user) {
      const restCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
      const hashedResetCode = await argon2.hash(restCode);
      const expiryDate = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes expiry time

      user.resetCode = hashedResetCode;
      user.resetCodeExpiry = expiryDate;

      await this.userService.update(user.id, {
        resetCode: hashedResetCode,
        resetCodeExpiry: expiryDate,
      });

      this.mailService.sendPasswordResetEmail(email, restCode);
    }
    return {
      message:
        'If the this user exists, they will receive an email to reset the password.',
      data: `Check your email.`,
    };
  }

  async validateCode(email: string, resetCode: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.resetCode) {
      throw new UnauthorizedException('Invalid reset code.');
    }

    if (user.resetCodeExpiry < new Date()) {
      throw new UnauthorizedException('Reset code has expired');
    }

    const isCodeValid = await argon2.verify(user.resetCode, resetCode);
    if (!isCodeValid) throw new UnauthorizedException('Invalid reset code.');

    return { message: 'the reset code is correct.', data: isCodeValid };
  }
}
