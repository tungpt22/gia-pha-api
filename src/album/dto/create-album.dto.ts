import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;
}