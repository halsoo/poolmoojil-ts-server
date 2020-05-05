import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToMany,
    Unique,
} from 'typeorm';

import { Length, IsEmail } from 'class-validator';
import { Address } from './Address';
import { OrderHistory } from './OrderHistory';
import { PackageSubsc } from './PackageSubsc';
import { PackageHistory } from './PackageHistory';
import { GatheringSubsc } from './GatheringSubsc';
import { GatheringHistory } from './GatheringHistory';

@Entity('users')
@Unique(['userID'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { name: 'userID' })
    @Length(5, 20)
    userID: string;

    @Column('text')
    name: string;

    @Column('text')
    hashedPassword: string;

    @Column('text')
    @Length(5, 100)
    @IsEmail()
    email: string;

    @Column('text')
    @Length(10, 12)
    phone: string;

    @Column('date', { nullable: true })
    birth: Date;

    @Column('text', { nullable: true })
    gender: string;

    @OneToMany((type) => Address, (address) => address.user)
    address: Address[];

    @OneToMany((type) => OrderHistory, (orderHistory) => orderHistory.user)
    orderHistories: OrderHistory[];

    @ManyToMany((type) => PackageSubsc, (packageSubsc) => packageSubsc.users)
    packageSubcs: PackageSubsc[];

    @OneToMany((type) => PackageHistory, (packageHistory) => packageHistory.user)
    packageHistories: PackageHistory[];

    @ManyToMany((type) => GatheringSubsc, (gatheringSubsc) => gatheringSubsc.users)
    gatheringSubscs: GatheringSubsc[];

    @OneToMany((type) => GatheringHistory, (gatheringHistory) => gatheringHistory.user)
    gatheringHistories: GatheringHistory[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
