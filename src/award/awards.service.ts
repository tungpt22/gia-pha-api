import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Award, AwardStatus } from './award.entity';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import { User } from '../user/user.entity';

@Injectable()
export class AwardsService {
    constructor(
        @InjectRepository(Award)
        private repo: Repository<Award>,
    ) {}

    async create(dto: CreateAwardDto) {
        const award = this.repo.create({
            content: dto.content,
            user: { id: dto.userId } as User,
            amount: dto.amount,
            other_reward: dto.other_reward,
            status: dto.status ?? AwardStatus.PENDING,
            award_date: dto.award_date,
            file_attachment: dto.file_attachment,
            is_highlight: dto.is_highlight
        });

        return await this.repo.save(award);
    }

    async findAll(
        page = 1,
        limit = 10,
        status?: AwardStatus,
        search?: string,
        is_highlight?: boolean,
    ) {
        const qb = this.repo.createQueryBuilder('award')
            .leftJoinAndSelect('award.user', 'user')
            .orderBy('award.created_at', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        if (status) {
            qb.andWhere('award.status = :status', { status });
        }

        if (search) {
            qb.andWhere('award.content ILIKE :search', { search: `%${search}%` });
        }

        if (is_highlight !== undefined) {
            qb.andWhere('award.is_highlight = :is_highlight', { is_highlight });
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
        const award = await this.repo.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!award) throw new NotFoundException('Award not found');
        return award;
    }

    async update(id: string, dto: UpdateAwardDto) {
        const award = await this.findOne(id);
        Object.assign(award, dto);
        return await this.repo.save(award);
    }

    async remove(id: string) {
        const award = await this.findOne(id);
        return await this.repo.softRemove(award);
    }
}
