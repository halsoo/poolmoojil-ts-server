import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    ManyToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable,
} from 'typeorm';

import { User } from './User';
import { Gathering } from './Gathering';

@Entity('gatheringSubscs')
export class GatheringSubsc {
    @PrimaryGeneratedColumn('uuid')
    id: string | undefined;

    @Column('int', { nullable: true })
    count: number | undefined;

    @OneToOne((type) => Gathering, {
        cascade: true,
        onDelete: 'SET NULL',
        primary: false,
    })
    @JoinColumn()
    gathering: Gathering | undefined;

    @ManyToMany((type) => User, (user) => user.gatheringSubscs, {
        cascade: true,
        onDelete: 'SET NULL',
        primary: true,
    })
    @JoinTable()
    users: User[] | undefined;

    @Column('daterange', { nullable: true })
    gatheringPeriod: string | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
