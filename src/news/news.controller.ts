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
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import type { Response as ExpressResponse } from 'express';
const FRONT_BASE = process.env.FRONT_BASE ?? 'http://localhost:8080';
const API_FILE_BASE = process.env.API_FILE_BASE ?? 'http://localhost:3000';

@Controller('news')
export class NewsController {
  constructor(private readonly service: NewsService) {}

  @Post()
  async create(@Body() dto: CreateNewsDto) {
    return await this.service.create(dto);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('is_publish') is_publish?: string,
  ) {
    return await this.service.findAll(
      Number(page),
      Number(limit),
      search,
      is_publish !== undefined ? is_publish === 'true' : undefined,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateNewsDto) {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(id);
  }

  @Get('pages/:id')
  async renderHtmlPage(@Param('id') id: string, @Res() res: ExpressResponse) {
    try {
      // dùng service hiện tại của bạn để lấy 1 bản ghi
      const found = await this.service.findOne(id);
      const n: any = (found as any)?.data ?? found; // hỗ trợ cả dạng {message,data} hoặc entity raw

      if (!n) return res.status(404).send('Not Found');

      const title = escapeHtml(n.title ?? '');
      const updated = n.updated_at ?? n.created_at;
      const updatedLabel = updated
        ? new Date(updated).toLocaleString('vi-VN')
        : '';
      const content = n.content ?? '';

      const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
<base href="${API_FILE_BASE}/">
<style>
:root{--ink:#111827;--muted:#6b7280;}
*{box-sizing:border-box}
body{margin:0;background:#fafafa;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.7}
.wrap{max-width:900px;margin:24px auto;padding:0 14px}
.top{margin-bottom:12px}
.back{display:inline-block;padding:8px 12px;border:1px solid #e5e7eb;border-radius:10px;background:#fff;color:#111827;text-decoration:none}
.article{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:18px}
h1{font-size:32px;margin:4px 0 8px;font-weight:900;color:var(--ink)}
.date{font-size:13px;color:var(--muted);font-style:italic;margin-bottom:14px}
.content img{max-width:100%;height:auto;display:block;margin:10px auto}
</style>
</head>
<body>
  <div class="wrap">
    <div class="top"><a class="back" href="${FRONT_BASE}/admin/news">← Quay lại</a></div>
    <article class="article">
      <h1>${title}</h1>
      <div class="date">Cập nhật: ${updatedLabel}</div>
      <div class="content">${content}</div>
    </article>
  </div>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    } catch {
      return res.status(500).send('Internal Server Error');
    }
  }
}

function escapeHtml(input: string) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
