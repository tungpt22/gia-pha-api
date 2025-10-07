import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put, Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './event.entity';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    async create(@Body() dto: CreateEventDto): Promise<Event> {
        return this.eventsService.create(dto);
    }

    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search?: string,
    ) {
        return this.eventsService.findAll(Number(page), Number(limit), search);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Event> {
        return this.eventsService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateEventDto,
    ): Promise<Event> {
        return this.eventsService.update(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.eventsService.remove(id);
    }
}