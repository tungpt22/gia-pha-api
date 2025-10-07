import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserActivityDto {
    @IsDateString()
    start_date: Date;

    @IsDateString()
    @IsOptional()
    end_date?: Date;

    @IsString()
    description: string;

    @IsString()
    @IsOptional()
    position: string;

    @IsOptional()
    @IsString()
    reward?: string;
}
