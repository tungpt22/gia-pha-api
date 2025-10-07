import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancesService } from './finances.service';
import { FinancesController } from './finances.controller';
import { Finance } from './finance.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Finance])],
    providers: [FinancesService],
    controllers: [FinancesController],
})
export class FinancesModule {}