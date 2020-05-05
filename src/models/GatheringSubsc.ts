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
    id: string;

    @OneToOne((type) => Gathering)
    @JoinColumn()
    gathering: Gathering;

    @ManyToMany((type) => User, (user) => user.gatheringSubscs)
    @JoinTable()
    users: User[];

    @Column('daterange', { nullable: true })
    gatheringPeriod: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
