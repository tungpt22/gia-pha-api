import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Album} from './album.entity';
import {CreateAlbumDto} from './dto/create-album.dto';
import {UpdateAlbumDto} from './dto/update-album.dto';
import {Photo} from "./photo.entity";
import * as fs from 'fs';
import * as path from 'path';
import {UpdatePhotoDto} from "./dto/update-photo.dto";

@Injectable()
export class AlbumsService {
    constructor(
        @InjectRepository(Album)
        private readonly albumRepo: Repository<Album>,
        @InjectRepository(Photo)
        private readonly photoRepo: Repository<Photo>,
    ) {
    }

    async create(dto: CreateAlbumDto): Promise<Album> {
        const album = this.albumRepo.create(dto);
        return this.albumRepo.save(album);
    }

    async findAll(page = 1, limit = 10, search?: string) {
        const query = this.albumRepo.createQueryBuilder('album');

        if (search) {
            query.where('LOWER(album.name) LIKE :search OR LOWER(album.description) LIKE :search', {
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

    async findOne(id: string): Promise<Album> {
        const album = await this.albumRepo.findOne({where: {id}});
        if (!album) {
            throw new NotFoundException(`Album id ${id} không tồn tại`);
        }
        return album;
    }

    async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
        await this.albumRepo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const album = await this.findOne(id);
        await this.albumRepo.softRemove(album);
    }


    async addPhoto(albumId: string, file: Express.Multer.File, name?: string) {
        const album = await this.albumRepo.findOne({where: {id: albumId}});
        if (!album) {
            throw new NotFoundException(`Album id ${albumId} không tồn tại`);
        }

        // Nếu client không truyền name thì dùng tên file gốc
        const photoName = name || file.originalname;
        const fileUrl = `/uploads/albums/${albumId}/${file.filename}`;

        const photo = this.photoRepo.create({
            album,
            name: photoName,
            url: fileUrl,
        });

        return await this.photoRepo.save(photo);
    }

    async getPhotos(albumId: string): Promise<Photo[]> {
        return this.photoRepo.find({
            where: {album: {id: albumId}},
            order: {created_dt: 'DESC'},
        });
    }

    async removePhoto(albumId: string, photoId: string) {
        const photo = await this.photoRepo.findOne({
            where: {id: photoId, album: {id: albumId}},
            relations: ['album'],
        });

        if (!photo) {
            throw new NotFoundException(`Photo id ${photoId} không tồn tại trong album ${albumId}`);
        }

        // Xoá file vật lý
        try {
            const filePath = path.join(process.cwd(), photo.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (e) {
            console.log(e);
        }

        // Xoá bản ghi DB
        await this.photoRepo.delete(photoId);

        return {message: 'Photo deleted successfully'};
    }

    async updatePhoto(photoId: string, albumId: string,  dto: UpdatePhotoDto) {
        const album = await this.albumRepo.findOne({where: {id: albumId}});
        if (!album) {
            throw new NotFoundException(`Album id ${albumId} không tồn tại`);
        }

        const photo = await this.photoRepo.findOne({ where: { id: photoId } });
        if (!photo) {
            throw new NotFoundException(`Photo id ${photoId} không tồn tại`);
        }

        Object.assign(photo, dto);
        return await this.photoRepo.save(photo);
    }
}