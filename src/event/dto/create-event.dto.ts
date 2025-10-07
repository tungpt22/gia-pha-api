import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDateString()
    event_date: Date;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsOptional()
    description?: string;
}