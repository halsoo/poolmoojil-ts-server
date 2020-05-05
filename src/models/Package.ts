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

@Entity('packages')
export class Package {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne((type) => Image, { nullable: true })
    @JoinColumn()
    mainImg: Image;

    @Column('text')
    title: string;

    @Column('text')
    desc: string;

    @ManyToMany((type) => Book)
    @JoinTable()
    bookList: Book[];

    @OneToOne((type) => Image, { nullable: true })
    @JoinColumn()
    additionalImg: Image;

    @Column('daterange', { nullable: true })
    date: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
