import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Image } from './Image';

@Entity('goods')
export class Good {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne((type) => Image, { nullable: true })
    @JoinColumn()
    mainImg: Image;

    @Column('text')
    name: string;

    @Column('text', { nullable: true })
    type: string;

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

    @OneToOne((type) => Image, { nullable: true })
    @JoinColumn()
    additionalImg: Image;
}
