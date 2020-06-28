import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToMany,
    Unique,
    OneToOne,
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
    id: string | undefined;

    @Column('text', { name: 'userID' })
    @Length(5, 20)
    userID: string | undefined;

    @Column('boolean', { nullable: true })
    isAdmin: boolean | undefined;

    @Column('text', { nullable: true })
    membership: string | undefined;

    @Column('text')
    name: string | undefined;

    @Column('text', { select: false })
    hashedPassword: string | undefined;

    @Column('text')
    @Length(5, 100)
    @IsEmail()
    email: string | undefined;

    @Column('text')
    @Length(10, 12)
    phone: string | undefined;

    @Column('date', { nullable: true })
    birth: string | undefined;

    @Column('text', { nullable: true })
    gender: string | undefined;

    @OneToMany((type) => Address, (address) => address.user)
    address: Address[] | undefined;

    @Column('boolean', { nullable: true })
    newsLetter: boolean | undefined;

    @Column('int', { nullable: true })
    credit: number | undefined;

    @Column('json', { nullable: true })
    cart: object | undefined;

    @OneToMany((type) => OrderHistory, (orderHistory) => orderHistory.user)
    orderHistories: OrderHistory[] | undefined;

    @OneToMany((type) => PackageSubsc, (packageSubsc) => packageSubsc.user)
    packageSubscs: PackageSubsc[] | undefined;

    @OneToMany((type) => PackageHistory, (packageHistory) => packageHistory.user)
    packageHistories: PackageHistory[] | undefined;

    @ManyToMany((type) => GatheringSubsc, (gatheringSubsc) => gatheringSubsc.users)
    gatheringSubscs: GatheringSubsc[] | undefined;

    @OneToMany((type) => GatheringHistory, (gatheringHistory) => gatheringHistory.user)
    gatheringHistories: GatheringHistory[] | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
