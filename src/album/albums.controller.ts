import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './album.entity';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import * as path from 'path';
import * as fs from 'fs';
import {UpdatePhotoDto} from "./dto/update-photo.dto";

@Controller('albums')
export class AlbumsController {
    constructor(private readonly albumsService: AlbumsService) {}

    @Post()
    async create(@Body() dto: CreateAlbumDto): Promise<Album> {
        return this.albumsService.create(dto);
    }

    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search?: string,
    ) {
        return this.albumsService.findAll(Number(page), Number(limit), search);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Album> {
        return this.albumsService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateAlbumDto): Promise<Album> {
        return this.albumsService.update(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.albumsService.remove(id);
    }

    @Post(':id/upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const albumId = req.params.id;
                    const uploadPath = `./uploads/albums/${albumId}`;
                    if (!fs.existsSync(uploadPath)) {
                        fs.mkdirSync(uploadPath, { recursive: true });
                    }
                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + path.extname(file.originalname));
                }
            }),
            fileFilter: (req, file, cb) => {
                // chỉ cho phép các loại ảnh
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                    return cb(new BadRequestException('Chỉ được phép upload file ảnh'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 10 * 1024 * 1024, // giới hạn 10MB
            },
        }),
    )
    async uploadFile(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body('name') name?: string,
    ) {
        const photo = await this.albumsService.addPhoto(id, file, name);
        return { message: 'Photo uploaded successfully', data: photo };
    }

    // Lấy danh sách ảnh trong album
    @Get(':id/photos')
    async getPhotos(@Param('id') id: string) {
        const photos = await this.albumsService.getPhotos(id);
        return { message: 'OK', data: photos };
    }

    @Delete(':albumId/photos/:photoId')
    async deletePhoto(
        @Param('albumId') albumId: string,
        @Param('photoId') photoId: string,
    ) {
        return this.albumsService.removePhoto(albumId, photoId);
    }

    @Put(':albumId/photos/:id')
    async updatePhoto(
        @Param('albumId') albumId: string,
        @Param('id') id: string,
        @Body() dto: UpdatePhotoDto,
    ) {
        const photo = await this.albumsService.updatePhoto(id, albumId, dto);
        return { message: 'Photo updated successfully', data: photo };
    }
}