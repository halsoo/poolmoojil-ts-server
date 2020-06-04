import { BaseContext } from 'koa';
import { getManager, Repository, Between } from 'typeorm';

import { Package } from '../models/Package';

export default class PackageController {
    public static async getPackages(ctx: BaseContext, next: any) {
        try {
            //get a user repository to perform operations with user
            const packageRepository: Repository<Package> = getManager().getRepository(Package);

            const req = ctx.request.body;

            const calendar = new Date();
            const month = calendar.getMonth();
            const year = calendar.getFullYear();

            let upperMonthStr = '';
            if (month < 10) upperMonthStr = '0' + month.toString();
            else upperMonthStr = month.toString();

            const upperDate = year.toString() + '-' + upperMonthStr + '-' + '01';

            let lowerMonthStr = '';
            let lowerYear = 0;
            let lowerMonth = 0;

            const offset = req.page * req.offset;
            const monthOffset = offset % 12;
            const yearOffset = Math.floor(offset / 12);

            lowerYear = year - yearOffset;

            if (month - monthOffset < 1) {
                lowerYear = lowerYear - 1;
                lowerMonth = 12 + (month - monthOffset);
            } else {
                lowerMonth = month - monthOffset;
            }

            if (lowerMonth < 10) lowerMonthStr = '0' + lowerMonth.toString();
            else lowerMonthStr = lowerMonth.toString();

            const lowerDate = lowerYear.toString() + '-' + lowerMonthStr + '-' + '01';

            const packages: Package[] = await packageRepository.find({
                relations: ['mainImg', 'bookList'],
                order: { date: 'DESC' },
                where: { date: Between(lowerDate, upperDate) },
                skip: (req.page - 1) * req.offset,
                take: req.offset,
            });

            ctx.status = 200;
            ctx.body = packages;
        } catch {
            ctx.status = 404;
        }
    }

    public static async getPackageID(ctx: BaseContext) {
        // get a user repository to perform operations with user
        const packageRepository: Repository<Package> = getManager().getRepository(Package);
        // load user by id
        const singlePackage: Package = await packageRepository.findOne({
            join: {
                alias: 'package',
                leftJoinAndSelect: {
                    mainImg: 'package.mainImg',
                    monthlyCurated: 'package.monthlyCurated',
                    monthlyCuratedBook: 'monthlyCurated.book',
                    monthlyCuratedBookImg: 'monthlyCuratedBook.mainImg',
                    bookList: 'package.bookList',
                    BookMainImg: 'bookList.mainImg',
                    goodList: 'package.goodList',
                    GoodMainImg: 'goodList.mainImg',
                },
            },
            where: { id: ctx.params.id },
        });

        if (singlePackage) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = singlePackage;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }

    public static async getPackageMonthly(ctx: BaseContext) {
        // get a user repository to perform operations with user
        const packageRepository: Repository<Package> = getManager().getRepository(Package);

        const calendar = new Date();
        const month = calendar.getMonth() + 1;
        const year = calendar.getFullYear().toString();
        let monthStr = '';

        if (month < 10) monthStr = '0' + month.toString();
        else monthStr = month.toString();

        const date = year + '-' + monthStr + '-' + '01';
        // load user by id
        const singlePackage: Package = await packageRepository.findOne({
            join: {
                alias: 'package',
                leftJoinAndSelect: {
                    mainImg: 'package.mainImg',
                    bookList: 'package.bookList',
                },
            },
            where: {
                date: date,
            },
        });

        if (singlePackage) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = singlePackage;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }
}
