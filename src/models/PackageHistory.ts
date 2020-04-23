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
import { Package } from './Package';

@Entity('packageHistories')
export class PackageHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne((type) => Package)
    @JoinColumn()
    package: Package;

    @ManyToOne((type) => User, (user) => user.packageHistories)
    user: User;

    @Column('date', { nullable: true })
    purchaseDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
