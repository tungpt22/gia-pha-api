import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum FinanceType {
    INCOME = 'Thu',
    EXPENSE = 'Chi',
}

@Entity('finances')
export class Finance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: FinanceType,
    })
    type: FinanceType; // thu/chi

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number; // số tiền

    @Column({ type: 'date' })
    finance_date: Date; // ngày

    @Column({ type: 'text', nullable: true })
    description: string; // mô tả

    @CreateDateColumn()
    created_dt: Date;

    @UpdateDateColumn()
    updated_dt: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}