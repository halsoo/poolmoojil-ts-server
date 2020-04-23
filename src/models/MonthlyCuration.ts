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

    @ManyToMany((type) => Book, { nullable: true })
    @JoinTable()
    book: Book[];

    @ManyToMany((type) => Good, { nullable: true })
    @JoinTable()
    good: Good[];

    @Column('date', { nullable: true })
    date: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
