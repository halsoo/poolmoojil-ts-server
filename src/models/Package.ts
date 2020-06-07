import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Image } from './Image';
import { Book } from './Book';
import { Good } from './Good';
import { MonthlyCuration } from './MonthlyCuration';

@Entity('packages')
export class Package {
    @PrimaryGeneratedColumn('uuid')
    id: string | undefined;

    @OneToOne((type) => Image, { nullable: true, cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    mainImg: Image | undefined;

    @Column('text')
    title: string | undefined;

    @Column('text')
    desc: string | undefined;

    @Column('money', { nullable: true })
    price: number | undefined;

    @OneToOne((type) => MonthlyCuration, { nullable: true })
    @JoinColumn()
    monthlyCurated: MonthlyCuration | undefined;

    @ManyToMany((type) => Book, {
        nullable: true,
        cascade: true,
        onDelete: 'SET NULL',
    })
    @JoinTable()
    bookList: Book[] | undefined;

    @ManyToMany((type) => Good, {
        nullable: true,
        cascade: true,
        onDelete: 'SET NULL',
    })
    @JoinTable()
    goodList: Good[] | undefined;

    @Column('text', { nullable: true })
    packageList: string | undefined;

    @OneToOne((type) => Image, { nullable: true, cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    additionalImg: Image | undefined;

    @Column('date', { nullable: true })
    date: string | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
