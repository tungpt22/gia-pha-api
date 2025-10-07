import {Controller, Get, Post, Put, Delete, Param, Body, Query, BadRequestException} from '@nestjs/common';
import { AwardsService } from './awards.service';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import { AwardStatus } from './award.entity';

@Controller('awards')
export class AwardsController {
    constructor(private readonly service: AwardsService) {}

    @Post()
    async create(@Body() dto: CreateAwardDto) {
        return await this.service.create(dto);
    }

    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('status') status?: AwardStatus,
        @Query('search') search?: string,
        @Query('is_highlight') is_highlight?: string,
    ) {
        // noinspection TypeScriptValidateTypes
        if (status && !Object.values(AwardStatus).includes(status)) {
            throw new BadRequestException(`Trạng thái phải nằm trong: ${Object.values(AwardStatus).join(', ')}`);
        }
        return await this.service.findAll(
            Number(page),
            Number(limit),
            status,
            search,
            is_highlight !== undefined ? is_highlight === 'true' : undefined,
        );
    }


    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.service.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateAwardDto) {
        return await this.service.update(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.service.remove(id);
    }
}
