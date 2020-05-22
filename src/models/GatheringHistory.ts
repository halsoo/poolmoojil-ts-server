import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Max } from 'class-validator';
import { User } from './User';
import { Gathering } from './Gathering';

@Entity('gatheringHistories')
export class GatheringHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne((type) => Gathering, {
        cascade: true,
        onDelete: 'SET NULL',
        primary: false,
    })
    @JoinColumn()
    gathering: Gathering;

    @ManyToOne((type) => User, (user) => user.gatheringHistories, {
        cascade: true,
        onDelete: 'SET NULL',
        primary: true,
    })
    user: User;

    @Column('int', { nullable: true })
    @Max(3)
    headCount: number;

    @Column('timestamp')
    purchaseDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
