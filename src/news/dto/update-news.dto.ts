import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateNewsDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    thumbnail?: string;

    @IsBoolean()
    @IsOptional()
    is_publish?: boolean;
}
