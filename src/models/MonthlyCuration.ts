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
    id: string | undefined;

    @ManyToMany((type) => Book, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    @JoinTable()
    book: Book[] | undefined;

    @ManyToMany((type) => Good, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    @JoinTable()
    good: Good[] | undefined;

    @Column('date', { nullable: true })
    date: string | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
