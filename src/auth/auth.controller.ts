import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { MicrosoftAuthGuard } from './guards/microsoft-auth/microsoft-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EmailDto } from './dto/email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const { email, password, ...profileField } = createUserDto;
    const profileData: CreateProfileDto = profileField as CreateProfileDto;

    return this.userService.create(createUserDto, profileData);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request) {
    return this.authService.login(request.user.id, false);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('admin/login')
  async adminLogin(@Request() request) {
    return this.authService.login(request.user.id, true);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user.id, false);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('admin/refresh')
  async adminRefreshToken(@Req() req) {
    return this.authService.refreshToken(req.user.id, true);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    this.authService.logout(req.user.id);
    return { message: 'Logout successful' };
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.login(req.user.id, false);
    const redirectUrl = new URL(
      `${process.env.HOST_IP_ADDRESS}:3001/google-redirect`,
    ); // temporary page
    redirectUrl.searchParams.set('accessToken', response.data.accessToken);
    redirectUrl.searchParams.set('refreshToken', response.data.refreshToken);

    return res.redirect(redirectUrl.toString());
  }

  @Public()
  @UseGuards(MicrosoftAuthGuard)
  @Get('microsoft/login')
  async microsoftLogin() {}

  @Public()
  @UseGuards(MicrosoftAuthGuard)
  @Get('microsoft/callback')
  async microsoftCallback(@Req() req, @Res() res) {
    const response = await this.authService.login(req.user.id, false);
    const redirectUrl = new URL(
      `${process.env.HOST_IP_ADDRESS}:3001/microsoft-redirect`,
    ); // temporary page
    redirectUrl.searchParams.set('accessToken', response.data.accessToken);
    redirectUrl.searchParams.set('refreshToken', response.data.refreshToken);

    return res.redirect(redirectUrl.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      req.user.id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  @Public()
  @Post('send-verification-email')
  async sendVerificationEmail(@Body() emailDto: EmailDto) {
    return this.authService.sendCodeEmail(emailDto.email);
  }

  @Public()
  @Patch('forget-password')
  async forgetPassword(@Body() forgetPasswordDto: CreateUserDto) {
    return this.authService.forgetPassword(
      forgetPasswordDto.email,
      forgetPasswordDto.password,
    );
  }

  @Public()
  @Post('validate-otpCode')
  async validateResetCode(@Body() resetPasswordDto: ResetPasswordDto) {
    if (!resetPasswordDto.email)
      throw new BadRequestException('Email is required');

    if (!resetPasswordDto.otp)
      throw new BadRequestException('Reset code is required');

    return this.authService.validateCode(
      resetPasswordDto.email,
      resetPasswordDto.otp,
    );
  }
}
