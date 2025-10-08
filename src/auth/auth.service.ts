import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(phone_number: string, password: string) {
    const user = await this.userService.findByPhoneNumber(phone_number);
    if (user == null) return null;
    // Hash the provided password with the stored salt
    const hashedPassword = await bcrypt.hash(password, user.salt);

    if (user && hashedPassword === user.password) {
      const { password, salt, ...result } = user;
      return result;
    }
    return null;
  }

  async login(phone_number: string, password: string) {
    const user = await this.validateUser(phone_number, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  generateResetToken(userId: string): string {
    // Here you can either generate a JWT token or a random string
    return this.jwtService.sign({ sub: userId }, { expiresIn: '30m' });
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { id, password } = resetPasswordDto;
    const user = await this.userService.findOne(resetPasswordDto.id);

    if (!user) {
      throw new NotFoundException(`Người dùng ID ${id} không tồn tại`);
    }

    const salt = await this.userService.createSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.salt = salt;

    await this.userService.save(user);

    return { message: 'Password reset successfully' };
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { oldPassword, newPassword } = dto;

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`Người dùng ID ${userId} không tồn tại`);
    }

    // So khớp mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu cũ không đúng');
    }

    // Không cho trùng mật khẩu cũ
    if (oldPassword === newPassword) {
      throw new UnauthorizedException(
        'Mật khẩu mới không được trùng mật khẩu cũ',
      );
    }

    // Tạo salt & hash mật khẩu mới, đúng với cách resetPassword đang làm
    const salt = await this.userService.createSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.salt = salt;

    await this.userService.save(user);

    return { message: 'Đổi mật khẩu thành công' };
  }
}
