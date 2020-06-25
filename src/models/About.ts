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
    id: string | undefined;

    @Column('integer', { nullable: true })
    order: number | undefined;

    @Column('boolean', { nullable: true })
    isShow: boolean | undefined;

    @Column('text')
    title: string | undefined;

    @Column('text')
    body: string | undefined;

    @Column('text', { nullable: true })
    emphasis: string | undefined;

    @Column('text', { nullable: true })
    date: string | undefined;

    @Column('text', { nullable: true })
    writer: string | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;
}
