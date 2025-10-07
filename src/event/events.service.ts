import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepo: Repository<Event>,
    ) {}

    async create(dto: CreateEventDto): Promise<Event> {
        const event = this.eventRepo.create(dto);
        return this.eventRepo.save(event);
    }

    async findAll(page = 1, limit = 10, search?: string) {
        const query = this.eventRepo.createQueryBuilder('event');

        if (search) {
            query.where('LOWER(event.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }

        query.skip((page - 1) * limit).take(limit);

        const [data, total] = await query.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string): Promise<Event> {
        const event = await this.eventRepo.findOne({ where: { id } });
        if (!event) {
            throw new NotFoundException(`Sự kiện ID ${id} không tồn tại`);
        }
        return event;
    }

    async update(id: string, dto: UpdateEventDto): Promise<Event> {
        await this.eventRepo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const event = await this.findOne(id);
        await this.eventRepo.softRemove(event);
    }
}