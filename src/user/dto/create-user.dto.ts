import {
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender, Role, Status } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsDateString()
  birthday: Date;

  @IsDateString()
  @IsOptional()
  death_day?: Date;

  @IsString()
  password: string;

  @IsString()
  salt: string;

  @IsString()
  @IsOptional()
  profile_img?: string;

  @IsEnum(Status)
  @IsOptional()
  status: Status;
}
