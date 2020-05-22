import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable,
} from 'typeorm';

import { Book } from './Book';
import { Good } from './Good';

@Entity('monthlyCuration')
export class MonthlyCuration {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToMany((type) => Book, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    @JoinTable()
    book: Book[];

    @ManyToMany((type) => Good, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    @JoinTable()
    good: Good[];

    @Column('date', { nullable: true })
    date: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
