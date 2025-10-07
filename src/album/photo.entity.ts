import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Album } from './album.entity';

@Entity('photos')
export class Photo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Album, (album) => album.photos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'album_id' })
    album: Album;

    @Column({ type: 'varchar', length: 255 })
    name: string;   //  tên ảnh

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column()
    url: string;    // đường dẫn

    @CreateDateColumn()
    created_dt: Date;

    @UpdateDateColumn()
    updated_dt: Date;
}