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
    id: string | undefined;

    @OneToOne((type) => Package)
    @JoinColumn()
    package: Package | undefined;

    @ManyToMany((type) => User, (user) => user.packageSubscs, {
        cascade: true,
        onDelete: 'SET NULL',
        primary: true,
    })
    @JoinTable()
    users: User[] | undefined;

    @Column('daterange', { nullable: true })
    packagePeriod: Date | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
