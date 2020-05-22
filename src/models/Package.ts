import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Image } from './Image';
import { Book } from './Book';
import { Good } from './Good';

@Entity('packages')
export class Package {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne((type) => Image, { nullable: true, cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    mainImg: Image;

    @Column('text')
    title: string;

    @Column('text')
    desc: string;

    @Column('money', { nullable: true })
    price: number;

    @ManyToMany((type) => Book, {
        nullable: true,
        cascade: true,
        onDelete: 'SET NULL',
    })
    @JoinTable()
    bookList: Book[];

    @ManyToMany((type) => Good, {
        nullable: true,
        cascade: true,
        onDelete: 'SET NULL',
    })
    @JoinTable()
    goodList: Good[];

    @OneToOne((type) => Image, { nullable: true, cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    additionalImg: Image;

    @Column('date', { nullable: true })
    date: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
