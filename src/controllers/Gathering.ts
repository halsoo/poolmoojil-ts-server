import { BaseContext } from 'koa';
import { getManager, Repository, Like } from 'typeorm';

import { Gathering } from '../models/Gathering';
import { User } from '../models/User';
import { Address } from '../models/Address';

export default class GatheringController {
    public static async getGatherings(ctx: BaseContext, next: any) {
        try {
            //get a user repository to perform operations with user
            const gatheringRepository: Repository<Gathering> = getManager().getRepository(
                Gathering,
            );

            const req = ctx.request.body;

            const where = {};

            if (req.category !== undefined) where.category = req.category;
            if (req.isOver !== undefined) where.isOver = req.isOver;
            if (req.place !== undefined) where.place.name = req.place;
            if (req.title !== undefined) where.title = Like(req.title);

            const gatherings: Gathering[] = await gatheringRepository.find({
                relations: ['mainImg', 'place'],
                order: { isOver: 'ASC' },
                where: where,
                skip: (req.page - 1) * req.offset,
                take: req.offset,
            });

            ctx.status = 200;
            ctx.body = gatherings;
        } catch {
            ctx.status = 404;
        }
    }

    public static async getGatheringID(ctx: BaseContext) {
        // get a user repository to perform operations with user
        const gatheringRepository: Repository<Gathering> = getManager().getRepository(Gathering);
        // load user by id
        const gathering: Gathering = await gatheringRepository.findOne({
            join: {
                alias: 'gathering',
                leftJoinAndSelect: {
                    mainImg: 'gathering.mainImg',
                    books: 'gathering.books',
                    BookMainImg: 'books.mainImg',
                    place: 'gathering.place',
                },
            },
            where: { id: ctx.params.id },
        });

        if (gathering) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = gathering;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }
}
