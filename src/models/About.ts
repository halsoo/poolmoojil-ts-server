import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('abouts')
export class About {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('boolean', { nullable: true })
    isShow: boolean;

    @Column('text')
    title: string;

    @Column('text')
    body: string;

    @Column('text', { nullable: true })
    emphasis: string;

    @Column('text', { nullable: true })
    date: string;

    @Column('text', { nullable: true })
    writer: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
