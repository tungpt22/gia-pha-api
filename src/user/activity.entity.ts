import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity, Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('activities')
export class Activity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @ManyToOne(() => User, (user) => user.activities, { createForeignKeyConstraints: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'date' })
    start_date: Date;

    @Column({ type: 'date', nullable: true })
    end_date: Date | null;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    position: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    reward: string | null;

    @CreateDateColumn()
    created_dt: Date;

    @UpdateDateColumn()
    updated_dt: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}