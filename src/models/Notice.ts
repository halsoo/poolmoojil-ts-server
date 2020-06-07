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
    id: string | undefined;

    @Column('text')
    @Length(100)
    title: string | undefined;

    @Column('text')
    desc: string | undefined;

    @OneToOne((type) => Image, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    @JoinColumn()
    img: Image | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
