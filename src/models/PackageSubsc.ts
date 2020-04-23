import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    ManyToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable,
} from 'typeorm';

import { User } from './User';
import { Package } from './Package';

@Entity('packageSubscs')
export class PackageSubsc {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne((type) => Package)
    @JoinColumn()
    package: Package;

    @ManyToMany((type) => User, (user) => user.packageSubscs)
    @JoinTable()
    users: User[];

    @Column('date', { nullable: true })
    packagePeriod: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
