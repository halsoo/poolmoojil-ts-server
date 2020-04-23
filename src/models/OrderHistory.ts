import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { User } from './User';
import { Book } from './Book';
import { Good } from './Good';

@Entity('orderHistories')
export class OrderHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne((type) => User, (user) => user.orderHistories)
    user: User;

    @Column('boolean')
    isBook: boolean;

    @OneToOne((type) => Book, { nullable: true })
    @JoinColumn()
    book: Book;

    @OneToOne((type) => Good, { nullable: true })
    @JoinColumn()
    good: Good;

    @Column('text', { nullable: true })
    additionalAddress: string;

    @Column('int', { nullable: true })
    creditUse: number;

    @Column('money', { nullable: true })
    totalPrice: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
