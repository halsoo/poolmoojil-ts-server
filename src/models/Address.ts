import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Length } from 'class-validator';
import { User } from './User';

@Entity('addresses')
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string | undefined;

    @ManyToOne((type) => User, (user) => user.address, {
        cascade: true,
        onDelete: 'CASCADE',
        primary: true,
    })
    user: User | undefined;

    @Column('text')
    @Length(1, 100)
    name: string | undefined;

    @Column('text')
    @Length(5, 6)
    zip: string | undefined;

    @Column('text', { nullable: true })
    addressA: string | undefined;

    @Column('text', { nullable: true })
    addressB: string | undefined;

    @Column('boolean', { nullable: true })
    isIslandMountainousArea: boolean | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
