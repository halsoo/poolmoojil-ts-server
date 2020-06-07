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
    id: string | undefined;

    @OneToOne((type) => Package, {
        nullable: false,
        cascade: true,
        onDelete: 'SET NULL',
        primary: false,
    })
    @JoinColumn()
    package: Package | undefined;

    @ManyToOne((type) => User, (user) => user.packageHistories, {
        nullable: false,
        cascade: true,
        onDelete: 'SET NULL',
        primary: false,
    })
    user: User | undefined;

    @Column('timestamp', { nullable: true })
    purchaseDate: Date | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
