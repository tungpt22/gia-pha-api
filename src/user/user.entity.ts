import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Activity } from './activity.entity';

export enum Role {
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest',
}

export enum Gender {
  NAM = 'Nam',
  NU = 'Nữ',
}

export enum Status {
  ALIVE = 'alive',
  DEAD = 'dead',
  LOCK = 'lock',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.MEMBER,
  })
  role: Role;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.NAM,
  })
  gender: Gender;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ALIVE,
  })
  status: Status;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, unique: true })
  phone_number: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'date' })
  birthday: Date;

  @Column({ type: 'date', nullable: true })
  death_day: Date;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  salt: string;

  @Column({ nullable: true })
  profile_img: string;

  @CreateDateColumn()
  created_dt: Date;

  @UpdateDateColumn()
  updated_dt: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];
}
