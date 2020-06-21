import { getManager, getConnection, Repository, Between } from 'typeorm';

import { About } from '../models/About';
import { Image } from '../models/Image';

import moment from 'moment';
import 'moment/locale/ko';

export default class AboutController {
    public static async getTexts(ctx: any, next: any) {
        try {
            const aboutTexts = await getConnection()
                .createQueryBuilder()
                .select('abouts')
                .from(About, 'abouts')
                .where('abouts.isShow = :value', { value: true })
                .getMany();

            ctx.body = aboutTexts;
        } catch (err) {
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                message: err.message,
            };
        }
        await next();
    }

    public static async deleteText(ctx: any, next: any) {
        try {
            const aboutRepository: Repository<About> = getManager().getRepository(About);
            const about: About | undefined = await aboutRepository.findOne({
                where: { id: ctx.params.id },
            });

            if (about) {
                await aboutRepository.remove(about);
                ctx.status = 204;
            } else {
                ctx.status = 400;
                ctx.body = "The about you are trying to delete doesn't exist in the db";
            }
        } catch (err) {
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                message: err.message,
            };
        }
        await next();
    }

    public static async getTextID(ctx: any, next: any) {
        try {
            const aboutRepository: Repository<About> = getManager().getRepository(About);
            const about: About | undefined = await aboutRepository.findOne({
                where: { id: ctx.params.id },
            });

            console.log(about);

            if (about) {
                ctx.status = 200;
                ctx.body = about;
            } else {
                ctx.status = 400;
                ctx.body = "The about you are trying to find doesn't exist in the db";
            }
        } catch (err) {
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                message: err.message,
            };
        }
        await next();
    }

    public static async createText(ctx: any, next: any) {
        try {
            const imageRepository: Repository<Image> = getManager().getRepository(Image);
            const aboutRepository: Repository<About> = getManager().getRepository(About);

            const about = new About();

            const req = ctx.request.body;

            if (req.isShow) about.isShow = req.isShow;
            if (req.title) about.title = req.title;
            if (req.body) about.body = req.body;
            if (req.emphasis) about.emphasis = req.emphasis;
            if (req.date) about.date = req.date;
            if (req.writer) about.writer = req.writer;

            const newabout = aboutRepository.save(about);

            if (newabout) {
                ctx.status = 200;
            } else {
                ctx.status = 500;
            }
        } catch (err) {
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                message: err.message,
            };
        }
        await next();
    }

    public static async updateText(ctx: any, next: any) {
        try {
            const imageRepository: Repository<Image> = getManager().getRepository(Image);
            const aboutRepository: Repository<About> = getManager().getRepository(About);
            const about: About | any = await aboutRepository.findOne({
                where: { id: ctx.request.body.id },
            });

            const req = ctx.request.body;

            if (about) {
                if (req.isShow) about.isShow = req.isShow;
                if (req.title) about.title = req.title;
                if (req.body) about.body = req.body;
                if (req.emphasis) about.emphasis = req.emphasis;
                if (req.date) about.date = req.date;
                if (req.writer) about.writer = req.writer;

                const savedabout = aboutRepository.save(about);

                if (savedabout) {
                    ctx.status = 200;
                } else {
                    ctx.status = 500;
                }
            } else {
                ctx.status = 400;
                ctx.body = "The about you are trying to edit doesn't exist in the db";
            }
        } catch (err) {
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                message: err.message,
            };
        }
        await next();
    }
}
