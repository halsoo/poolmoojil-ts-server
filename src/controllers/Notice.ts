import { getManager, Repository, MoreThan } from 'typeorm';

import { Notice } from '../models/Notice';
import { Image } from '../models/Image';
import { Package } from 'src/models/Package';

export default class NoticeController {
    public static async getNotices(ctx: any, next: any) {
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

    public static async getNoticeID(ctx: any) {
        // get a user repository to perform operations with user
        const noticeRepository: Repository<Notice> = getManager().getRepository(Notice);
        // load user by id
        const notice: Notice | undefined = await noticeRepository.findOne({
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

    public static async deleteNotice(ctx: any) {
        // get a user repository to perform operations with user
        try {
            const noticeRepository: Repository<Notice> = getManager().getRepository(Notice);
            // load user by id
            const notice: Notice | any = await noticeRepository.findOne({
                join: {
                    alias: 'notice',
                    leftJoinAndSelect: {
                        img: 'notice.img',
                    },
                },
                where: { id: ctx.params.id },
            });

            await noticeRepository.remove(notice);
            ctx.status = 204;
        } catch (err) {
            // return a BAD REQUEST status code and error message
            console.log(err);
            ctx.status = 404;
        }
    }

    public static async createNotice(ctx: any, next: any) {
        try {
            //get a user repository to perform operations with user
            const imageRepository: Repository<Image> = getManager().getRepository(Image);
            const noticeRepository: Repository<Notice> = getManager().getRepository(Notice);

            const req = ctx.request.body;

            const notice: Notice = new Notice();

            if (req.img) {
                const mainImg = new Image();
                mainImg.name = req.img.substring(65);
                mainImg.link = req.img;
                const newMainImg = await imageRepository.save(mainImg);
                notice.img = newMainImg;
            }

            notice.title = req.title;
            notice.desc = req.desc;

            const newNotice = await noticeRepository.save(notice);

            ctx.status = 200;
            ctx.body = newNotice;
        } catch (err) {
            console.log(err);
            ctx.status = 404;
        }
    }

    public static async editNotice(ctx: any, next: any) {
        try {
            //get a user repository to perform operations with user
            const imageRepository: Repository<Image> = getManager().getRepository(Image);
            const noticeRepository: Repository<Notice> = getManager().getRepository(Notice);

            const req = ctx.request.body;

            const notice: Notice | any = await noticeRepository.findOne({
                join: {
                    alias: 'notice',
                    leftJoinAndSelect: {
                        img: 'notice.img',
                    },
                },
                where: { id: req.id },
            });

            if (req.img) {
                const oldImage: any = await imageRepository.findOne({
                    where: { id: notice.img.id },
                });

                await imageRepository.remove(oldImage);

                const mainImg = new Image();
                mainImg.name = req.img.substring(65);
                mainImg.link = req.img;
                const newMainImg = await imageRepository.save(mainImg);
                notice.img = newMainImg;
            }

            notice.title = req.title;
            notice.desc = req.desc;

            const newNotice = await noticeRepository.save(notice);

            ctx.status = 200;
            ctx.body = newNotice;
        } catch (err) {
            console.log(err);
            ctx.status = 404;
        }
    }
}
