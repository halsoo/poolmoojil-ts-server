import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Length } from 'class-validator';
import { Gathering } from './Gathering';

@Entity('places')
export class Place {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    @Length(100)
    name: string;

    @Column('text')
    address: string;

    @Column('text', { nullable: true })
    subAddress: string;

    @Column('text', { nullable: true })
    weekday: string;

    @Column('time', { nullable: true })
    weekdayOpen: string;

    @Column('time', { nullable: true })
    weekdayClose: string;

    @Column('text', { nullable: true })
    shortday: string;

    @Column('time', { nullable: true })
    shortdayOpen: string;

    @Column('time', { nullable: true })
    shortdayClose: string;

    @Column('text', { nullable: true })
    closing: string;

    @Column('text', { nullable: true })
    phone: string;

    @Column('text', { nullable: true })
    fax: string;

    @Column('text', { nullable: true })
    insta: string;

    @Column('text', { nullable: true })
    email: string;

    @OneToMany((type) => Gathering, (gathering) => gathering.place, { nullable: true })
    gatherings: Gathering[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
