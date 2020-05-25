import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';

import { Book } from './Book';
import { Good } from './Good';

@Entity('images')
export class Image {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    link: string;

    @ManyToOne((type) => Book, (book) => book.additionalImg, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    @JoinColumn()
    book: Book;

    @ManyToOne((type) => Good, (good) => good.additionalImg, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    @JoinColumn()
    good: Good;

    @CreateDateColumn()
    createdAt: Date;
}
