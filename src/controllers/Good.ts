import { getManager, Repository, Between } from 'typeorm';

import { Good } from '../models/Good';

export default class GoodController {
    public static async getGoods(ctx: any, next: any) {
        try {
            //get a user repository to perform operations with user
            const goodRepository: Repository<Good> = getManager().getRepository(Good);

            const req = ctx.request.body;

            const goods: Good[] = await goodRepository.find({
                relations: ['mainImg'],
                skip: (req.page - 1) * req.offset,
                take: req.offset,
            });

            ctx.status = 200;
            ctx.body = goods;
        } catch {
            ctx.status = 404;
        }
    }

    public static async getGoodID(ctx: any) {
        // get a user repository to perform operations with user
        const goodRepository: Repository<Good> = getManager().getRepository(Good);
        // load user by id
        const good: Good | undefined = await goodRepository.findOne({
            join: {
                alias: 'good',
                leftJoinAndSelect: {
                    mainImg: 'good.mainImg',
                },
            },
            where: { id: ctx.params.id },
        });

        if (good) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = good;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }
}
