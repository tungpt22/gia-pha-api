import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn, Unique,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';


export enum RelationType {
    FATHER = 'Bố',
    MOTHER = 'Mẹ',
    WIFE = 'Vợ',
    HUSBAND = 'Chồng',
    CHILD = 'Con',
}

@Entity('relationships')
@Unique(['from_user', 'to_user', 'relation_type'])
export class Relationship {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE', createForeignKeyConstraints: false })
    @JoinColumn({ name: 'from_user_id' })
    from_user: User;

    @ManyToOne(() => User, { onDelete: 'CASCADE', createForeignKeyConstraints: false })
    @JoinColumn({ name: 'to_user_id' })
    to_user: User;

    @Column({
        type: 'enum',
        enum: RelationType,
    })
    relation_type: RelationType;

    @CreateDateColumn()
    created_dt: Date;

    @UpdateDateColumn()
    updated_dt: Date;
}