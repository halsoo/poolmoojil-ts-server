import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Image } from './Image';

@Entity('books')
export class Book {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne((type) => Image, { nullable: true })
    @JoinColumn()
    mainImg: Image;

    @Column('text', { nullable: true })
    type: string;

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

    @Column('text', { nullable: true })
    ISBN: string;

    @Column('text', { nullable: true })
    dimensions: string;

    @Column('text', { nullable: true })
    weights: string;

    @Column('text', { nullable: true })
    desc: string;

    @OneToOne((type) => Image, { nullable: true })
    @JoinColumn()
    additionalImg: Image[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
