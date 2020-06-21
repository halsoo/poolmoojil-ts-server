import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';

import { Book } from './Book';

@Entity('monthlyCuration')
export class MonthlyCuration {
    @PrimaryGeneratedColumn('uuid')
    id: string | undefined;

    @ManyToOne((type) => Book, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    book: Book | undefined;

    @Column('date', { nullable: true })
    date: string | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
