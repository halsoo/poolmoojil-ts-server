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
    id: string | undefined;

    @Column('text')
    name: string | undefined;

    @Column('text')
    link: string | undefined;

    @ManyToOne((type) => Book, (book) => book.additionalImg, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    @JoinColumn()
    book: Book | undefined;

    @ManyToOne((type) => Good, (good) => good.additionalImg, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    @JoinColumn()
    good: Good | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;
}
