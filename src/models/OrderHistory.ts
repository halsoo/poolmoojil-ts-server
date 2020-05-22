import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';

import { User } from './User';
import { Book } from './Book';
import { Good } from './Good';

@Entity('orderHistories')
export class OrderHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne((type) => User, (user) => user.orderHistories, {
        cascade: true,
        onDelete: 'SET NULL',
        primary: true,
    })
    user: User;

    @Column('boolean')
    isBook: boolean;

    @ManyToMany((type) => Book, {
        nullable: true,
        cascade: true,
        onDelete: 'SET NULL',
        primary: true,
    })
    @JoinTable()
    books: Book[];

    @ManyToMany((type) => Good, {
        nullable: true,
        cascade: true,
        onDelete: 'SET NULL',
        primary: true,
    })
    @JoinTable()
    goods: Good[];

    @Column('text', { nullable: true })
    additionalAddress: string;

    @Column('text', { nullable: true })
    transactionStatus: string;

    @Column('int', { nullable: true })
    creditUse: number;

    @Column('money', { nullable: true })
    totalPrice: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
