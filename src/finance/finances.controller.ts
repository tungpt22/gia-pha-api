import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express'; // kiểu Response (Express)
import { FinancesService } from './finances.service';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { Finance } from './finance.entity';
import { Workbook } from 'exceljs';

@Controller('finances')
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  @Post()
  async create(@Body() dto: CreateFinanceDto): Promise<Finance> {
    return this.financesService.create(dto);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('type') type?: string,
  ) {
    return this.financesService.findAll(
      Number(page),
      Number(limit),
      search,
      type,
    );
  }

  @Get('export')
  async exportExcel(
    @Res() res: Response, // Express Response
    @Query('search') search?: string,
    @Query('type') type?: string,
  ) {
    const rows = await this.financesService.findForExport(search, type);

    const wb = new Workbook();
    const ws = wb.addWorksheet('Finances');

    // Header
    ws.addRow(['Tên khoản', 'Loại', 'Số tiền', 'Ngày']);

    // Data
    rows.forEach((r) => {
      ws.addRow([
        r.description ?? '',
        r.type ?? '',
        typeof r.amount === 'string' ? Number(r.amount) || r.amount : r.amount,
        r.finance_date ?? '',
      ]);
    });

    // Auto width
    ws.columns?.forEach((col) => {
      let max = 10;
      col.eachCell?.({ includeEmpty: true }, (cell) => {
        const v = String(cell.value ?? '');
        max = Math.max(max, v.length + 2);
      });
      col.width = Math.min(max, 50);
    });

    const fileName = `finances_${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, '-')}.xlsx`;

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    await wb.xlsx.write(res); // stream trực tiếp ra response
    res.end();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Finance> {
    return this.financesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFinanceDto,
  ): Promise<Finance> {
    return this.financesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.financesService.remove(id);
  }
}
