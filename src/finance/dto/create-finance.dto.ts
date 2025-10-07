import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import {FinanceType} from "../finance.entity";

export class CreateFinanceDto {
    @IsEnum(FinanceType)
    type: FinanceType;

    @IsNumber()
    amount: number;

    @IsDateString()
    finance_date: Date;

    @IsString()
    @IsOptional()
    description?: string;
}