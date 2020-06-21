import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Length } from 'class-validator';
import { Gathering } from './Gathering';
import { Image } from './Image';

@Entity('places')
export class Place {
    @PrimaryGeneratedColumn('uuid')
    id: string | undefined;

    @Column('text')
    @Length(100)
    name: string | undefined;

    @Column('text')
    address: string | undefined;

    @Column('text', { nullable: true })
    subAddress: string | undefined;

    @Column('text', { nullable: true })
    weekday: string | undefined;

    @Column('time', { nullable: true })
    weekdayOpen: string | undefined;

    @Column('time', { nullable: true })
    weekdayClose: string | undefined;

    @Column('text', { nullable: true })
    shortday: string | undefined;

    @Column('time', { nullable: true })
    shortdayOpen: string | undefined;

    @Column('time', { nullable: true })
    shortdayClose: string | undefined;

    @Column('text', { nullable: true })
    closing: string | undefined;

    @Column('text', { nullable: true })
    phone: string | undefined;

    @Column('text', { nullable: true })
    fax: string | undefined;

    @Column('text', { nullable: true })
    insta: string | undefined;

    @Column('text', { nullable: true })
    email: string | undefined;

    @OneToMany((type) => Gathering, (gathering) => gathering.place, { nullable: true })
    gatherings: Gathering[] | any;

    @OneToOne((type) => Image, { nullable: true, cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    mainImg: Image | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
