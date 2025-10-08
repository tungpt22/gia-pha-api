import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UserService } from '../user/user.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import { SendEmailService } from '../email/send-email.service';
import { Public } from '../security/public.decorator';
import { Roles } from '../security/roles.decorator';
import { Role } from '../user/user.entity';
import { RolesGuard } from '../security/roles.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly sendEmailService: SendEmailService,
  ) {}

  @Post('login')
  @Public()
  async login(@Body() body: { phone_number: string; password: string }) {
    return this.authService.login(body.phone_number, body.password);
  }

  @Post('logout')
  @Public()
  async logout(@Body() body: { token: string }) {
    return 'OK';
  }

  @Post('reset-password')
  @Roles(Role.ADMIN) // Only users with 'admin' role can access
  @UseGuards(RolesGuard)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    const userId = req.user?.userId;
    return this.authService.changePassword(userId, dto);
  }
}
