import {IsNotEmpty, IsString, IsUUID} from 'class-validator';

export class ResetPasswordDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}