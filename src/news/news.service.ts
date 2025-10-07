import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { News } from './news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(News)
        private repo: Repository<News>,
    ) {}

    async create(dto: CreateNewsDto) {
        const news = this.repo.create(dto);
        return await this.repo.save(news);
    }

    async findAll(page = 1, limit = 10, search?: string, is_publish?: boolean) {
        const qb = this.repo.createQueryBuilder('news')
            .orderBy('news.created_at', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        if (search) {
            qb.andWhere('(news.title ILIKE :search OR news.content ILIKE :search)', {
                search: `%${search}%`,
            });
        }

        if (is_publish !== undefined) {
            qb.andWhere('news.is_publish = :is_publish', { is_publish });
        }

        const [data, total] = await qb.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
        };
    }

    async findOne(id: string) {
        const news = await this.repo.findOne({ where: { id } });
        if (!news) throw new NotFoundException('News not found');
        return news;
    }

    async update(id: string, dto: UpdateNewsDto) {
        const news = await this.findOne(id);
        Object.assign(news, dto);
        return await this.repo.save(news);
    }

    async remove(id: string) {
        const news = await this.findOne(id);
        return await this.repo.softRemove(news);
    }
}
