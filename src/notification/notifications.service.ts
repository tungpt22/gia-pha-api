import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private repo: Repository<Notification>,
    ) {}

    async create(dto: CreateNotificationDto) {
        const notification = this.repo.create(dto);
        return await this.repo.save(notification);
    }

    async findAll(page = 1, limit = 10, search?: string) {
        const [data, total] = await this.repo.findAndCount({
            where: search ? { title: ILike(`%${search}%`) } : {},
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            total,
            page,
            limit,
        };
    }

    async findOne(id: string) {
        const notification = await this.repo.findOne({ where: { id } });
        if (!notification) throw new NotFoundException('Notification not found');
        return notification;
    }

    async update(id: string, dto: UpdateNotificationDto) {
        const notification = await this.findOne(id);
        Object.assign(notification, dto);
        return await this.repo.save(notification);
    }

    async remove(id: string) {
        const notification = await this.findOne(id);
        return await this.repo.remove(notification);
    }
}