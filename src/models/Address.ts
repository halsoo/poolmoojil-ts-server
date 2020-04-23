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
    id: string;

    @ManyToOne((type) => User, (user) => user.address)
    user: User;

    @Column('text')
    @Length(100)
    name: string;

    @Column('text')
    @Length(5, 6)
    zip: string;

    @Column('text', { nullable: true })
    district: string;

    @Column('text', { nullable: true })
    city: string;

    @Column('text', { nullable: true })
    town: string;

    @Column('text', { nullable: true })
    street: string;

    @Column('text', { nullable: true })
    home: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
