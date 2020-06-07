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
    id: string | undefined;

    @OneToOne((type) => Image, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        primary: false,
    })
    @JoinColumn()
    mainImg: Image | undefined;

    @Column('text')
    name: string | undefined;

    @Column('text', { nullable: true })
    type: string | undefined;

    @Column('int', { nullable: true })
    quantity: number | undefined;

    @Column('money')
    price: number | undefined;

    @Column('text', { nullable: true })
    maker: string | undefined;

    @Column('text', { nullable: true })
    designer: string | undefined;

    @Column('text', { nullable: true })
    dimensions: string | undefined;

    @Column('text', { nullable: true })
    color: string | undefined;

    @Column('text', { nullable: true })
    desc: string | undefined;

    @OneToMany((type) => Image, (image) => image.good, {
        nullable: true,
    })
    @JoinColumn()
    additionalImg: Image[] | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
