import {IsOptional, IsString, IsNumber, IsEnum, IsDateString, IsBoolean, IsUUID, IsNotEmpty} from 'class-validator';
import { AwardStatus } from '../award.entity';

export class UpdateAwardDto {
    @IsString()
    @IsOptional()
    content?: string;

    @IsUUID()
    @IsOptional()
    userId?: string;


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
