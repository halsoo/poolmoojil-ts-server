import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';

import { Book } from './Book';
import { Image } from './Image';

@Entity('gatherings')
export class Gathering {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne((type) => Image, { nullable: true })
    @JoinColumn()
    mainImg: Image;

    @Column('text')
    title: string;

    @Column('tsrange')
    date: Date;

    @Column('text', { nullable: true })
    format: string;

    @Column('text', { nullable: true })
    speaker: string;

    @OneToOne((type) => Book, { nullable: true })
    book: Book;

    @Column('text')
    desc: string;

    @OneToOne((type) => Image, { nullable: true })
    @JoinColumn()
    additionalImg: Image[];

    @Column('text', { nullable: true })
    liveLink: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
