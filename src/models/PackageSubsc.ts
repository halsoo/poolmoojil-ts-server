import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable,
    OneToMany,
} from 'typeorm';

import { User } from './User';
import { Package } from './Package';
import { PackageHistory } from './PackageHistory';

@Entity('packageSubscs')
export class PackageSubsc {
    @PrimaryGeneratedColumn('uuid')
    id: string | undefined;

    @ManyToOne((type) => User, (user) => user.packageSubscs, {
        cascade: true,
        onDelete: 'SET NULL',
        primary: false,
    })
    @JoinColumn()
    user: User | undefined;

    @Column('text', { nullable: true })
    orderNum: string | undefined;

    @Column('text', { nullable: true })
    subscStatus: string | undefined;

    @Column('text', { nullable: true })
    name: string | undefined;

    @Column('text', { nullable: true })
    zip: string | undefined;

    @Column('text', { nullable: true })
    addressA: string | undefined;

    @Column('text', { nullable: true })
    addressB: string | undefined;

    @Column('text', { nullable: true })
    phone: string | undefined;

    @Column('text', { nullable: true })
    transactionStatus: string | undefined;

    @Column('money', { nullable: true })
    creditUse: number | undefined;

    @Column('money', { nullable: true })
    totalPrice: number | undefined;

    @Column('daterange', { nullable: true })
    packagePeriod: string | undefined;

    @OneToMany((type) => PackageHistory, (packageHistory) => packageHistory.packageSubsc, {
        nullable: false,
    })
    packageHistories: PackageHistory[] | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
