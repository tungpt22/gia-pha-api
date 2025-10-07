import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateNewsDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    thumbnail?: string;

    @IsBoolean()
    @IsOptional()
    is_publish?: boolean;
}
