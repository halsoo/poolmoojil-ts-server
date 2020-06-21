import { getManager, Repository, Between } from 'typeorm';

import { Good } from '../models/Good';
import { Image } from '../models/Image';

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
                    additionalImg: 'good.additionalImg',
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

    public static async createGood(ctx: any) {
        try {
            const imageRepository: Repository<Image> = getManager().getRepository(Image);
            const goodRepository: Repository<Good> = getManager().getRepository(Good);
            // load user by id
            const req = ctx.request.body;
            const good: Good = new Good();

            if (req.mainImg) {
                const mainImg = new Image();
                mainImg.name = req.mainImg.substring(65);
                mainImg.link = req.mainImg;
                const newMainImg = await imageRepository.save(mainImg);

                good.mainImg = newMainImg;
            }

            if (req.additionalImg) {
                const additionalImg = new Image();
                additionalImg.name = req.additionalImg.substring(65);
                additionalImg.link = req.additionalImg;
                const newAdditionalImg = await imageRepository.save(additionalImg);

                good.additionalImg = [newAdditionalImg];
            }

            good.type = req.type;
            good.quantity = req.quantity;
            good.name = req.name;
            good.price = req.price;
            good.maker = req.maker;
            good.designer = req.designer;
            good.dimensions = req.dimensions;
            good.color = req.color;
            good.desc = req.desc;

            const newGood = await goodRepository.save(good);

            if (newGood) {
                // return OK status code and loaded user object
                ctx.status = 200;
                ctx.body = newGood;
            } else {
                // return a BAD REQUEST status code and error message
                ctx.status = 404;
            }
        } catch (err) {
            console.log(err);
        }
    }

    public static async updateGood(ctx: any) {
        try {
            // get a user repository to perform operations with user
            const imageRepository: Repository<Image> = getManager().getRepository(Image);
            const goodRepository: Repository<Good> = getManager().getRepository(Good);
            // load user by id
            const req = ctx.request.body;
            const good: Good | any = await goodRepository.findOne({
                join: {
                    alias: 'book',
                    leftJoinAndSelect: {
                        mainImg: 'book.mainImg',
                        additionalImg: 'book.additionalImg',
                    },
                },
                where: { id: req.id },
            });

            if (req.mainImg) {
                const oldImage: any = await imageRepository.findOne({
                    where: { id: good.mainImg.id },
                });

                if (oldImage) {
                    if (oldImage.link === req.mainImg) {
                        good.mainImg = oldImage;
                    } else {
                        await imageRepository.remove(oldImage);

                        const mainImg = new Image();
                        mainImg.name = req.mainImg.substring(65);
                        mainImg.link = req.mainImg;
                        const newMainImg = await imageRepository.save(mainImg);

                        good.mainImg = newMainImg;
                    }
                } else {
                    const mainImg = new Image();
                    mainImg.name = req.mainImg.substring(65);
                    mainImg.link = req.mainImg;
                    const newMainImg = await imageRepository.save(mainImg);

                    good.mainImg = newMainImg;
                }
            }

            if (req.additionalImg.length !== 0) {
                if (good.additionalImg.length !== 0) {
                    const oldAddImage: any = await imageRepository.findOne({
                        where: { id: good.additionalImg[0].id },
                    });

                    await imageRepository.remove(oldAddImage);
                }

                const additionalImg = new Image();
                additionalImg.name = req.additionalImg.substring(65);
                additionalImg.link = req.additionalImg;
                const newAdditionalImg = await imageRepository.save(additionalImg);

                good.additionalImg = [newAdditionalImg];
            }

            good.type = req.type;
            good.quantity = req.quantity;
            good.name = req.name;
            good.price = req.price;
            good.maker = req.maker;
            good.designer = req.designer;
            good.dimensions = req.dimensions;
            good.color = req.color;
            good.desc = req.desc;

            const newGood = await goodRepository.save(good);

            if (newGood) {
                // return OK status code and loaded user object
                ctx.status = 200;
                ctx.body = newGood;
            } else {
                // return a BAD REQUEST status code and error message
                ctx.status = 404;
            }
        } catch (err) {
            console.log(err);
        }
    }

    public static async deleteGood(ctx: any) {
        try {
            // get a user repository to perform operations with user
            const goodRepository: Repository<Good> = getManager().getRepository(Good);
            // load user by id
            const good: Good | any = await goodRepository.findOne({
                join: {
                    alias: 'good',
                    leftJoinAndSelect: {
                        mainImg: 'good.mainImg',
                    },
                },
                where: { id: ctx.params.id },
            });

            await goodRepository.remove(good);

            ctx.status = 200;
        } catch {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }
}
