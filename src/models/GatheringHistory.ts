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
    id: string | undefined;

    @OneToOne((type) => Gathering, {
        cascade: true,
        onDelete: 'SET NULL',
        primary: false,
    })
    @JoinColumn()
    gathering: Gathering | undefined;

    @ManyToOne((type) => User, (user) => user.gatheringHistories, {
        cascade: true,
        onDelete: 'SET NULL',
        primary: true,
    })
    user: User | undefined;

    @Column('int', { nullable: true })
    @Max(3)
    headCount: number | undefined;

    @Column('timestamp')
    purchaseDate: Date | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
