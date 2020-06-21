import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Max } from 'class-validator';
import { User } from './User';
import { Gathering } from './Gathering';

@Entity('gatheringHistories')
export class GatheringHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string | undefined;

    @ManyToOne((type) => Gathering, (gathering) => gathering.gatheringHistories, {
        cascade: true,
        onDelete: 'SET NULL',
        primary: false,
    })
    gathering: Gathering | undefined;

    @Column('text', { nullable: true })
    orderNum: string | undefined;

    @ManyToOne((type) => User, (user) => user.gatheringHistories, {
        cascade: true,
        onDelete: 'SET NULL',
        primary: true,
    })
    user: User | undefined;

    @Column('text', { nullable: true })
    showUp: string | undefined;

    @Column('int', { nullable: true })
    @Max(3)
    headCount: number | undefined;

    @Column('date', { nullable: true })
    date: string | undefined;

    @Column('money', { nullable: true })
    creditUse: number | undefined;

    @Column('money', { nullable: true })
    totalPrice: number | undefined;

    @Column('date')
    purchaseDate: string | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
