import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum AwardStatus {
    APPROVED = 'Đã duyệt',
    PENDING = 'Chờ duyệt',
    REJECTED = 'Từ chối',
}

@Entity('awards')
export class Award {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    content: string; // Nội dung khen thưởng

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    amount: number | null; // Giá trị khen thưởng

    @Column({ type: 'varchar', length: 255, nullable: true })
    other_reward: string | null; // Khen thưởng khác

    @Column({
        type: 'enum',
        enum: AwardStatus,
        default: AwardStatus.PENDING,
    })
    status: AwardStatus;

    @Column({ type: 'date', nullable: true })
    award_date: Date | null; // Ngày khen thưởng

    @Column({ type: 'varchar', length: 500, nullable: true })
    file_attachment: string | null; // File đính kèm

    @Column({ type: 'boolean', default: false })
    is_highlight: boolean; // Có phải khen thưởng nổi bật không

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}
