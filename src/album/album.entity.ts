import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {Photo} from "./photo.entity";

@Entity('albums')
export class Album {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string; // tên album

    @Column({ type: 'text', nullable: true })
    description: string; // mô tả

    @CreateDateColumn()
    created_dt: Date;

    @UpdateDateColumn()
    updated_dt: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    @OneToMany(() => Photo, (photo) => photo.album)
    photos: Photo[];
}