import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany,
} from 'typeorm';

import { Book } from './Book';
import { Image } from './Image';
import { Place } from './Place';

@Entity('gatherings')
export class Gathering {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne((type) => Image, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    @JoinColumn()
    mainImg: Image;

    @Column('text')
    title: string;

    @Column('int', { nullable: true })
    count: number;

    @Column('money', { nullable: true })
    oncePrice: number;

    @Column('money', { nullable: true })
    fullPrice: number;

    @Column('daterange', { nullable: true })
    rangeDate: string;

    @Column('date', { nullable: true })
    oneTimeDate: string;

    @Column('time', { nullable: true })
    time: string;

    @Column('text', { nullable: true })
    stringDate: string;

    @Column('boolean', { nullable: true })
    isAll: boolean;

    @Column('boolean', { nullable: true })
    isOver: boolean;

    @ManyToOne((type) => Place, (place) => place.gatherings, {
        cascade: true,
        onDelete: 'SET NULL',
        primary: false,
    })
    place: Place;

    @Column('text')
    category: string;

    @Column('text')
    format: string;

    @Column('text', { nullable: true })
    speaker: string;

    @ManyToMany((type) => Book, (book) => book.gatherings, {
        nullabel: true,
        cascade: true,
        onDelete: 'SET NULL',
        primary: false,
    })
    @JoinTable()
    books: Book[];

    @Column('text')
    desc: string;

    @OneToOne((type) => Image, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    @JoinColumn()
    additionalImg: Image[];

    @Column('text', { nullable: true })
    liveLink: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
