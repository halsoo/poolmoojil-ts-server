import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';

import { User } from './User';
import { Package } from './Package';
import { PackageSubsc } from './PackageSubsc';

@Entity('packageHistories')
export class PackageHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string | undefined;

    @ManyToOne((type) => Package, (singlePackage) => singlePackage.packageHistories, {
        nullable: true,
        cascade: true,
        onDelete: 'SET NULL',
        primary: false,
    })
    package: Package | undefined;

    @ManyToOne((type) => User, (user) => user.packageHistories, {
        nullable: false,
        cascade: true,
        onDelete: 'SET NULL',
        primary: false,
    })
    user: User | undefined;

    @Column('boolean', { nullable: true })
    isSubsc: boolean | undefined;

    @Column('text', { nullable: true })
    orderNum: string | undefined;

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
    shippingFee: number | undefined;

    @Column('money', { nullable: true })
    totalPrice: number | undefined;

    @Column('date', { nullable: true })
    purchaseDate: string | undefined;

    @ManyToOne((type) => PackageSubsc, (packageSubsc) => packageSubsc.packageHistories, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    packageSubsc: PackageSubsc | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
