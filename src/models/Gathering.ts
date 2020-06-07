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
    id: string | undefined;

    @OneToOne((type) => Image, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    @JoinColumn()
    mainImg: Image | undefined;

    @Column('text')
    title: string | undefined;

    @Column('int', { nullable: true })
    count: number | undefined;

    @Column('money', { nullable: true })
    oncePrice: number | undefined;

    @Column('money', { nullable: true })
    fullPrice: number | undefined;

    @Column('daterange', { nullable: true })
    rangeDate: string | undefined;

    @Column('date', { nullable: true })
    oneTimeDate: string | undefined;

    @Column('time', { nullable: true })
    time: string | undefined;

    @Column('text', { nullable: true })
    stringDate: string | undefined;

    @Column('boolean', { nullable: true })
    isAll: boolean | undefined;

    @Column('boolean', { nullable: true })
    isOver: boolean | undefined;

    @ManyToOne((type) => Place, (place) => place.gatherings, {
        cascade: true,
        onDelete: 'SET NULL',
        primary: false,
    })
    place: Place | undefined;

    @Column('text')
    category: string | undefined;

    @Column('text')
    format: string | undefined;

    @Column('text', { nullable: true })
    speaker: string | undefined;

    @ManyToMany((type) => Book, (book) => book.gatherings, {
        nullable: true,
        cascade: true,
        onDelete: 'SET NULL',
        primary: false,
    })
    @JoinTable()
    books: Book[] | undefined;

    @Column('text')
    desc: string | undefined;

    @OneToOne((type) => Image, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    @JoinColumn()
    additionalImg: Image[] | undefined;

    @Column('text', { nullable: true })
    liveLink: string | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
