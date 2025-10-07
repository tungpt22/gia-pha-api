import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';

@Entity('news')
export class News {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    thumbnail: string | null;

    @Column({ type: 'boolean', default: false })
    is_publish: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}
