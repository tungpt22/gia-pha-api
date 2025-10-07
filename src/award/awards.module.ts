import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwardsService } from './awards.service';
import { AwardsController } from './awards.controller';
import { Award } from './award.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Award])],
    controllers: [AwardsController],
    providers: [AwardsService],
})
export class AwardsModule {}
