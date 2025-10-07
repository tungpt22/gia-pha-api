import { IsOptional, IsString } from 'class-validator';

export class UpdatePhotoDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;
}