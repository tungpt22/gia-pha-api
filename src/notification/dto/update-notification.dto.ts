import { IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;
}