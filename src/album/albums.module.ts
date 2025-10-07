import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './album.entity';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import {Photo} from "./photo.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Album, Photo])],
    providers: [AlbumsService],
    controllers: [AlbumsController],
})
export class AlbumsModule {}