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
    id: string | undefined;

    @ManyToOne((type) => User, (user) => user.orderHistories, {
        cascade: true,
        onDelete: 'SET NULL',
        primary: true,
    })
    user: User | undefined;

    @Column('boolean')
    isBook: boolean | undefined;

    @ManyToMany((type) => Book, {
        nullable: true,
        cascade: true,
        onDelete: 'SET NULL',
        primary: true,
    })
    @JoinTable()
    books: Book[] | undefined;

    @ManyToMany((type) => Good, {
        nullable: true,
        cascade: true,
        onDelete: 'SET NULL',
        primary: true,
    })
    @JoinTable()
    goods: Good[] | undefined;

    @Column('text', { nullable: true })
    additionalAddress: string | undefined;

    @Column('text', { nullable: true })
    transactionStatus: string | undefined;

    @Column('int', { nullable: true })
    creditUse: number | undefined;

    @Column('money', { nullable: true })
    totalPrice: number | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
