import { BaseContext } from 'koa';
import { getManager, Repository, MoreThan } from 'typeorm';

import { Notice } from '../models/Notice';

export default class NoticeController {
    public static async getNotices(ctx: BaseContext, next: any) {
        try {
            //get a user repository to perform operations with user
            const noticeRepository: Repository<Notice> = getManager().getRepository(Notice);

            const req = ctx.request.body;

            const notices: Notice[] = await noticeRepository.find({
                relations: ['img'],
                order: { createdAt: 'DESC' },
                skip: (req.page - 1) * req.offset,
                take: req.offset,
            });
            ctx.status = 200;
            ctx.body = notices;
        } catch {
            ctx.status = 404;
        }
    }

    public static async getNoticeID(ctx: BaseContext) {
        // get a user repository to perform operations with user
        const noticeRepository: Repository<Notice> = getManager().getRepository(Notice);
        // load user by id
        const notice: Notice = await noticeRepository.findOne({
            join: {
                alias: 'notice',
                leftJoinAndSelect: {
                    img: 'notice.img',
                },
            },
            where: { id: ctx.params.id },
        });

        if (notice) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = notice;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }
}
