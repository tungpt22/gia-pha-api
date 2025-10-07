import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string; // tên sự kiện

    @Column({ type: 'date' })
    event_date: Date; // ngày tổ chức

    @Column({ type: 'varchar', length: 255 })
    location: string; // địa điểm

    @Column({ type: 'text', nullable: true })
    description: string; // mô tả

    @CreateDateColumn()
    created_dt: Date;

    @UpdateDateColumn()
    updated_dt: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}