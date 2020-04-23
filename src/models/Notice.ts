import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Length } from 'class-validator';
import { Image } from './Image';

@Entity('notices')
export class Notice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    @Length(100)
    title: string;

    @Column('text')
    desc: string;

    @OneToOne((type) => Image, { nullable: true })
    @JoinColumn()
    img: Image;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
