import {IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsUUID, IsDateString, IsBoolean} from 'class-validator';
import { AwardStatus } from '../award.entity';

export class CreateAwardDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsNumber()
    @IsOptional()
    amount?: number;

    @IsString()
    @IsOptional()
    other_reward?: string;

    @IsEnum(AwardStatus)
    @IsOptional()
    status?: AwardStatus;

    @IsDateString()
    @IsOptional()
    award_date?: Date;

    @IsString()
    @IsOptional()
    file_attachment?: string;

    @IsBoolean()
    @IsOptional()
    is_highlight?: boolean;
}
