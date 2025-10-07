import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Finance } from './finance.entity';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';

@Injectable()
export class FinancesService {
  constructor(
    @InjectRepository(Finance)
    private readonly financeRepo: Repository<Finance>,
  ) {}

  async create(dto: CreateFinanceDto): Promise<Finance> {
    const finance = this.financeRepo.create(dto);
    return this.financeRepo.save(finance);
  }

  async findAll(page = 1, limit = 10, search?: string, type?: string) {
    const query = this.financeRepo.createQueryBuilder('finance');

    if (search) {
      query.andWhere('LOWER(finance.description) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    if (type) {
      query.andWhere('finance.type = :type', { type });
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

  async findOne(id: string): Promise<Finance> {
    const finance = await this.financeRepo.findOne({ where: { id } });
    if (!finance) {
      throw new NotFoundException(`Giao dịch ${id} không tồn tại`);
    }
    return finance;
  }

  async update(id: string, dto: UpdateFinanceDto): Promise<Finance> {
    await this.financeRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const finance = await this.findOne(id);
    await this.financeRepo.softRemove(finance);
  }

  async findForExport(search?: string, type?: string): Promise<Finance[]> {
    const query = this.financeRepo.createQueryBuilder('finance');

    if (search) {
      query.andWhere('LOWER(finance.description) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    if (type) {
      query.andWhere('finance.type = :type', { type });
    }

    return query.getMany();
  }
}
