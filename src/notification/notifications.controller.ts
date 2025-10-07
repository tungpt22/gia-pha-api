import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import {NotificationsService} from './notifications.service';
import {CreateNotificationDto} from './dto/create-notification.dto';
import {UpdateNotificationDto} from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly service: NotificationsService) {}

    @Post()
    async create(@Body() dto: CreateNotificationDto) {
        return await this.service.create(dto);
    }

    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search?: string,
    ) {
        return await this.service.findAll(Number(page), Number(limit), search);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.service.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateNotificationDto) {
        return await this.service.update(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.service.remove(id);
    }
}
