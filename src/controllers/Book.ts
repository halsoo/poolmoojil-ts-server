import { BaseContext } from 'koa';
import { getManager, Repository, Like, Between } from 'typeorm';

import { Book } from '../models/Book';
import { MonthlyCuration } from '../models/MonthlyCuration';

export default class BookController {
    public static async getBooks(ctx: BaseContext, next: any) {
        try {
            //get a user repository to perform operations with user
            const bookRepository: Repository<Book> = getManager().getRepository(Book);

            const req = ctx.request.body;
            const where = {};

            if (req.title !== undefined) where.title = Like(req.title);
            if (req.type !== undefined) where.type = req.type;
            if (req.author !== undefined) where.author = Like(req.author);
            if (req.publishingCompany !== undefined)
                where.publishingCompany = Like(req.publishingCompany);

            const books: Book[] = await bookRepository.find({
                relations: ['mainImg'],
                where: where,
                skip: (req.page - 1) * req.offset,
                take: req.offset,
            });

            ctx.status = 200;
            ctx.body = books;
        } catch {
            ctx.status = 404;
        }
    }

    public static async getBookID(ctx: BaseContext) {
        // get a user repository to perform operations with user
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        // load user by id
        const book: Book = await bookRepository.findOne({
            join: {
                alias: 'book',
                leftJoinAndSelect: {
                    mainImg: 'book.mainImg',
                    gatherings: 'book.gatherings',
                },
            },
            where: { id: ctx.params.id },
        });

        if (book) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = book;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }

    public static async getBookCurated(ctx: BaseContext) {
        // get a user repository to perform operations with user
        const curationRepository: Repository<MonthlyCuration> = getManager().getRepository(
            MonthlyCuration,
        );

        const req = ctx.request.body;

        const calendar = new Date();
        const month = calendar.getMonth() + 1;
        const year = calendar.getFullYear();

        let upperMonthStr = '';
        if (month < 10) upperMonthStr = '0' + month.toString();
        else upperMonthStr = month.toString();

        const upperDate = year.toString() + '-' + upperMonthStr + '-' + '01';

        let lowerMonthStr = '';
        let lowerYear = 0;
        let lowerMonth = 0;

        const offset = req.page * req.offset;
        console.log(req.page, req.offset);
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

        const lowerDate = lowerYear.toString() + '-' + lowerMonthStr + '-' + '02';
        // load user by id
        const curation: MonthlyCuration = await curationRepository.find({
            join: {
                alias: 'monthlyCuration',
                leftJoinAndSelect: {
                    book: 'monthlyCuration.book',
                    mainImg: 'book.mainImg',
                },
            },
            order: { date: 'DESC' },
            where: {
                date: Between(lowerDate, upperDate),
            },
            skip: (req.page - 1) * req.offset,
            take: req.offset,
        });

        if (curation) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = curation;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }

    public static async getBookSelected(ctx: BaseContext) {
        // get a user repository to perform operations with user
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        // load user by id

        const req = ctx.request.body;

        const books: Book = await bookRepository.find({
            join: {
                alias: 'book',
                leftJoinAndSelect: {
                    mainImg: 'book.mainImg',
                },
            },
            skip: (req.page - 1) * req.offset,
            take: req.offset,
            where: { type: '풀무질 인문학 100선' },
        });

        if (books) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = books;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }
}
