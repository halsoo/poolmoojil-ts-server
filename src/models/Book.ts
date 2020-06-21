import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToMany,
} from 'typeorm';

import { Image } from './Image';
import { Gathering } from './Gathering';
import { MonthlyCuration } from './MonthlyCuration';

@Entity('books')
export class Book {
    @PrimaryGeneratedColumn('uuid')
    id: string | undefined;

    @OneToOne((type) => Image, {
        nullable: true,
        cascade: true,
        onDelete: 'SET NULL',
        primary: false,
    })
    @JoinColumn()
    mainImg: Image | undefined;

    @Column('text', { nullable: true })
    type: string | undefined;

    @Column('int', { nullable: true })
    quantity: number | undefined;

    @Column('text')
    title: string | undefined;

    @Column('text')
    author: string | undefined;

    @Column('text', { nullable: true })
    translator: string | undefined;

    @Column('text')
    publishingCompany: string | undefined;

    @Column('int')
    pages: number | undefined;

    @Column('money')
    price: number | undefined;

    @Column('text', { nullable: true })
    editor: string | undefined;

    @Column('text', { nullable: true })
    designer: string | undefined;

    @Column('text', { nullable: true })
    publisher: string | undefined;

    @Column('date', { nullable: true })
    publishDate: string | undefined;

    @Column('text', { nullable: true })
    ISBN: string | undefined;

    @Column('text', { nullable: true })
    dimensions: string | undefined;

    @Column('text', { nullable: true })
    weights: string | undefined;

    @Column('text', { nullable: true })
    desc: string | undefined;

    @ManyToMany((type) => Gathering, (gathering) => gathering.books, {
        nullable: true,
    })
    gatherings: Gathering[] | undefined;

    @OneToMany((type) => Image, (image) => image.book, {
        nullable: true,
    })
    additionalImg: Image[] | undefined;

    @OneToMany((type) => MonthlyCuration, (monthlyCuration) => monthlyCuration.book, {
        nullable: true,
    })
    monthlyCurations: MonthlyCuration[] | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
