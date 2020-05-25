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

@Entity('books')
export class Book {
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

    @Column('text', { nullable: true })
    type: string;

    @Column('int', { nullable: true })
    quantity: number;

    @Column('text')
    title: string;

    @Column('text')
    author: string;

    @Column('text', { nullable: true })
    translator: string;

    @Column('text')
    publishingCompany: string;

    @Column('int')
    pages: number;

    @Column('money')
    price: number;

    @Column('text', { nullable: true })
    editor: string;

    @Column('text', { nullable: true })
    designer: string;

    @Column('text', { nullable: true })
    publisher: string;

    @Column('date', { nullable: true })
    publishDate: string;

    @Column('text', { nullable: true })
    ISBN: string;

    @Column('text', { nullable: true })
    dimensions: string;

    @Column('text', { nullable: true })
    weights: string;

    @Column('text', { nullable: true })
    desc: string;

    @ManyToMany((type) => Gathering, (gathering) => gathering.books, { nullable: true })
    gatherings: Gathering[];

    @OneToMany((type) => Image, (image) => image.book, {
        nullable: true,
    })
    additionalImg: Image[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
