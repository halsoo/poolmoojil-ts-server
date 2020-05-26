import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';

import { Image } from './Image';

@Entity('goods')
export class Good {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne((type) => Image, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    @JoinColumn()
    mainImg: Image;

    @Column('text')
    name: string;

    @Column('text', { nullable: true })
    type: string;

    @Column('int', { nullable: true })
    quantity: number;

    @Column('money')
    price: number;

    @Column('text', { nullable: true })
    maker: string;

    @Column('text', { nullable: true })
    designer: string;

    @Column('text', { nullable: true })
    dimensions: string;

    @Column('text', { nullable: true })
    color: string;

    @Column('text', { nullable: true })
    desc: string;

    @OneToMany((type) => Image, (image) => image.good, {
        nullable: true,
    })
    @JoinColumn()
    additionalImg: Image[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
