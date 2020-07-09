import { getManager, Repository, Like, Between } from 'typeorm';

import moment from 'moment';
import 'moment/locale/ko';

import { Book } from '../models/Book';
import { MonthlyCuration } from '../models/MonthlyCuration';
import { Image } from '../models/Image';

export default class BookController {
    public static async getBooks(ctx: any, next: any) {
        try {
            //get a user repository to perform operations with user
            const bookRepository: Repository<Book> = getManager().getRepository(Book);

            const req = ctx.request.body;
            const where: any = {};

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

    public static async getBookID(ctx: any) {
        // get a user repository to perform operations with user
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        // load user by id
        const book: Book | undefined = await bookRepository.findOne({
            join: {
                alias: 'book',
                leftJoinAndSelect: {
                    mainImg: 'book.mainImg',
                    additionalImg: 'book.additionalImg',
                    gatherings: 'book.gatherings',
                    monthlyCurations: 'book.monthlyCurations',
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

    public static async createBook(ctx: any) {
        try {
            // get a user repository to perform operations with user
            const curationRepository: Repository<MonthlyCuration> = getManager().getRepository(
                MonthlyCuration,
            );
            const imageRepository: Repository<Image> = getManager().getRepository(Image);
            const bookRepository: Repository<Book> = getManager().getRepository(Book);
            // load user by id
            const req = ctx.request.body;
            const book: Book = new Book();

            if (req.mainImg) {
                const mainImg = new Image();
                mainImg.name = req.mainImg.substring(65);
                mainImg.link = req.mainImg;
                const newMainImg = await imageRepository.save(mainImg);

                book.mainImg = newMainImg;
            }

            if (req.additionalImg) {
                const additionalImg = new Image();
                additionalImg.name = req.additionalImg.substring(65);
                additionalImg.link = req.additionalImg;
                const newAdditionalImg = await imageRepository.save(additionalImg);

                book.additionalImg = [newAdditionalImg];
            }

            book.type = req.type;
            book.quantity = req.quantity;
            book.title = req.title;
            book.price = req.price;
            book.author = req.author;
            book.translator = req.translator;
            book.publishingCompany = req.publishingCompany;
            book.editor = req.editor;
            book.designer = req.designer;
            book.publisher = req.publisher;
            book.publishDate = req.publishDate;
            book.ISBN = req.ISBN;
            book.pages = req.pages;
            book.dimensions = req.dimensions;
            book.weights = req.weights;
            book.desc = req.desc;

            if (req.monthlyCurations) {
                const newBook = await bookRepository.save(book);
                let mc: MonthlyCuration[] = [];

                for (const m in req.monthlyCurations) {
                    const newMonthly = new MonthlyCuration();
                    newMonthly.date = req.monthlyCurations[m];
                    const newNewMonthly = await curationRepository.save(newMonthly);
                    mc.push(newNewMonthly);
                }
                book.monthlyCurations = mc;
            }

            const newBook = await bookRepository.save(book);

            if (newBook) {
                // return OK status code and loaded user object
                ctx.status = 200;
                ctx.body = newBook;
            } else {
                // return a BAD REQUEST status code and error message
                ctx.status = 404;
            }
        } catch (err) {
            console.log(err);
        }
    }

    public static async updateBook(ctx: any) {
        try {
            // get a user repository to perform operations with user
            const curationRepository: Repository<MonthlyCuration> = getManager().getRepository(
                MonthlyCuration,
            );
            const imageRepository: Repository<Image> = getManager().getRepository(Image);
            const bookRepository: Repository<Book> = getManager().getRepository(Book);
            // load user by id
            const req = ctx.request.body;
            const book: Book | any = await bookRepository.findOne({
                join: {
                    alias: 'book',
                    leftJoinAndSelect: {
                        mainImg: 'book.mainImg',
                        additionalImg: 'book.additionalImg',
                        monthlyCurations: 'book.monthlyCurations',
                    },
                },
                where: { id: req.id },
            });

            if (req.mainImg) {
                const oldImage: any = await imageRepository.findOne({
                    where: { id: book.mainImg.id },
                });

                if (oldImage) {
                    if (oldImage.link === req.mainImg) {
                        book.mainImg = oldImage;
                    } else {
                        await imageRepository.remove(oldImage);

                        const mainImg = new Image();
                        mainImg.name = req.mainImg.substring(65);
                        mainImg.link = req.mainImg;
                        const newMainImg = await imageRepository.save(mainImg);

                        book.mainImg = newMainImg;
                    }
                } else {
                    const mainImg = new Image();
                    mainImg.name = req.mainImg.substring(65);
                    mainImg.link = req.mainImg;
                    const newMainImg = await imageRepository.save(mainImg);

                    book.mainImg = newMainImg;
                }
            }

            if (req.additionalImg.length !== 0) {
                if (book.additionalImg.length !== 0) {
                    const oldAddImage: any = await imageRepository.findOne({
                        where: { id: book.additionalImg[0].id },
                    });

                    await imageRepository.remove(oldAddImage);
                }

                if (!req.additionalImg[0].id) {
                    const additionalImg = new Image();
                    additionalImg.name = req.additionalImg.substring(65);
                    additionalImg.link = req.additionalImg;
                    const newAdditionalImg = await imageRepository.save(additionalImg);

                    book.additionalImg = [newAdditionalImg];
                }
            }

            if (req.monthlyCurations) {
                let mc: MonthlyCuration[] = [];

                for (const m in req.monthlyCurations) {
                    const curation: MonthlyCuration | undefined = await curationRepository.findOne({
                        where: {
                            date: req.monthlyCurations[m],
                        },
                    });

                    if (curation) {
                        if (curation.date === req.monthlyCurations[m]) {
                            mc.push(curation);
                        } else {
                            await curationRepository.remove(curation);

                            const newMonthly = new MonthlyCuration();
                            newMonthly.date = req.monthlyCurations[m];
                            const newNewMonthly = await curationRepository.save(newMonthly);
                            mc.push(newNewMonthly);
                        }
                    } else {
                        const newMonthly = new MonthlyCuration();
                        newMonthly.date = req.monthlyCurations[m];
                        const newNewMonthly = await curationRepository.save(newMonthly);
                        mc.push(newNewMonthly);
                    }

                    book.monthlyCurations = mc;
                }
            }

            book.type = req.type;
            book.quantity = req.quantity;
            book.title = req.title;
            book.price = req.price;
            book.author = req.author;
            book.translator = req.translator;
            book.publishingCompany = req.publishingCompany;
            book.editor = req.editor;
            book.designer = req.designer;
            book.publisher = req.publisher;
            book.publishDate = req.publishDate;
            book.ISBN = req.ISBN;
            book.pages = req.pages;
            book.dimensions = req.dimensions;
            book.weights = req.weights;
            book.desc = req.desc;

            const newBook = await bookRepository.save(book);

            if (newBook) {
                // return OK status code and loaded user object
                ctx.status = 200;
                ctx.body = newBook;
            } else {
                // return a BAD REQUEST status code and error message
                ctx.status = 404;
            }
        } catch (err) {
            console.log(err);
        }
    }

    public static async deleteBook(ctx: any) {
        try {
            // get a user repository to perform operations with user
            const bookRepository: Repository<Book> = getManager().getRepository(Book);
            // load user by id
            const book: Book | any = await bookRepository.findOne({
                join: {
                    alias: 'book',
                    leftJoinAndSelect: {
                        mainImg: 'book.mainImg',
                        additionalImg: 'book.additionalImg',
                        gatherings: 'book.gatherings',
                        monthlyCurations: 'book.monthlyCurations',
                    },
                },
                where: { id: ctx.params.id },
            });

            await bookRepository.remove(book);

            // return OK status code and loaded user object
            ctx.status = 204;
        } catch {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }

    public static async getBookCurated(ctx: any) {
        // get a user repository to perform operations with user
        const curationRepository: Repository<MonthlyCuration> = getManager().getRepository(
            MonthlyCuration,
        );

        const req = ctx.request.body;

        // const calendar = new Date();
        // const month = calendar.getMonth() + 1;
        // const year = calendar.getFullYear();

        // let upperMonthStr = '';
        // if (month < 10) upperMonthStr = '0' + month.toString();
        // else upperMonthStr = month.toString();

        // const upperDate = year.toString() + '-' + upperMonthStr + '-' + '01';

        // let lowerMonthStr = '';
        // let lowerYear = 0;
        // let lowerMonth = 0;

        // const offset = req.page * req.offset;

        // const monthOffset = offset % 12;
        // const yearOffset = Math.floor(offset / 12);

        // lowerYear = year - yearOffset;

        // if (month - monthOffset < 1) {
        //     lowerYear = lowerYear - 1;
        //     lowerMonth = 12 + (month - monthOffset);
        // } else {
        //     lowerMonth = month - monthOffset;
        // }

        // if (lowerMonth < 10) lowerMonthStr = '0' + lowerMonth.toString();
        // else lowerMonthStr = lowerMonth.toString();

        // const lowerDate = lowerYear.toString() + '-' + lowerMonthStr + '-' + '02';
        // load user by id

        const today = moment();
        const dayNum = today.isoWeekday();

        let diff = 0;

        switch (dayNum) {
            case 1:
                diff = 0;
                break;
            case 2:
                diff = 1;
                break;
            case 3:
                diff = 2;
                break;
            case 4:
                diff = 3;
                break;
            case 5:
                diff = 4;
                break;
            case 6:
                diff = 5;
                break;
            case 7:
                diff = 6;
                break;
        }

        const date = today.subtract(diff, 'days');

        const curation: MonthlyCuration[] = await curationRepository.find({
            join: {
                alias: 'monthlyCuration',
                leftJoinAndSelect: {
                    book: 'monthlyCuration.book',
                    mainImg: 'book.mainImg',
                },
            },
            order: { date: 'DESC' },
            where: {
                date: Between('2010-01-01', date.format('YYYY[-]MM[-]DD')),
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

    public static async getBookSelected(ctx: any) {
        // get a user repository to perform operations with user
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        // load user by id

        const req = ctx.request.body;

        const books: Book[] = await bookRepository.find({
            join: {
                alias: 'book',
                leftJoinAndSelect: {
                    mainImg: 'book.mainImg',
                },
            },
            skip: (req.page - 1) * req.offset,
            take: req.offset,
            where: { type: '베스트셀러' },
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
