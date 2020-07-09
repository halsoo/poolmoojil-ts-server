import { getManager, Repository, In, Like, Between, Raw, TableForeignKey } from 'typeorm';
import moment from 'moment';
import 'moment/locale/ko';

import {
    convertKorToDayNum,
    convertKorToWeekNum,
    rangeDateStr,
    nextMonthWeekDay,
} from '../lib/util';

import { User } from '../models/User';
import { Gathering } from '../models/Gathering';
import { GatheringHistory } from '../models/GatheringHistory';
import { Book } from '../models/Book';
import { Image } from '../models/Image';
import { Place } from '../models/Place';

export default class GatheringController {
    public static async createGathering(ctx: any, next: any) {
        const gatheringRepository: Repository<Gathering> = getManager().getRepository(Gathering);
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        const imageRepository: Repository<Image> = getManager().getRepository(Image);
        const placeRepository: Repository<Place> = getManager().getRepository(Place);

        const req = ctx.request.body;

        const books: Book[] = await bookRepository.find({
            relations: ['mainImg'],
            where: { id: In(Object.values(req.books)) },
        });

        const place: Place | any = await placeRepository.findOne({
            where: { name: req.place },
        });

        const newGathering = new Gathering();

        if (req.mainImg) {
            const mainImg = new Image();
            mainImg.name = req.mainImg.substring(65);
            mainImg.link = req.mainImg;
            const newMainImg = await imageRepository.save(mainImg);
            newGathering.mainImg = newMainImg;
        }

        newGathering.title = req.title;
        newGathering.count = req.count;
        newGathering.oncePrice = req.oncePrice;
        newGathering.fullPrice = req.fullPrice;
        newGathering.rangeDate = req.rangeDate;
        newGathering.oneTimeDate = req.oneTimeDate;
        newGathering.time = req.time;
        newGathering.stringDate = req.stringDate;
        newGathering.isAll = req.isAll;
        newGathering.isOver = false;
        newGathering.place = place;
        newGathering.category = req.category;
        newGathering.format = req.format;
        newGathering.speaker = req.speaker;
        newGathering.books = books;
        newGathering.desc = req.desc;
        newGathering.liveLink = req.liveLink;

        const savedGathering = await gatheringRepository.save(newGathering);

        if (savedGathering) {
            ctx.status = 200;
            ctx.body = savedGathering;
        } else {
            ctx.status = 500;
        }
    }

    public static async updateGathering(ctx: any, next: any) {
        const gatheringRepository: Repository<Gathering> = getManager().getRepository(Gathering);
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        const imageRepository: Repository<Image> = getManager().getRepository(Image);
        const placeRepository: Repository<Place> = getManager().getRepository(Place);

        const req = ctx.request.body;

        const gathering: Gathering | any = await gatheringRepository.findOne({
            join: {
                alias: 'gathering',
                leftJoinAndSelect: {
                    mainImg: 'gathering.mainImg',
                    place: 'gathering.place',
                },
            },
            where: { id: req.id },
        });
        console.log(gathering);

        const books: Book[] = await bookRepository.find({
            relations: ['mainImg'],
            where: { id: In(Object.values(req.books)) },
        });

        const place: Place | any = await placeRepository.findOne({
            where: { name: req.place },
        });

        if (req.mainImg) {
            if (gathering.mainImg) {
                const oldImage: any = await imageRepository.findOne({
                    where: { id: gathering.mainImg.id },
                });
                await imageRepository.remove(oldImage);
            }

            const mainImg = new Image();
            mainImg.name = req.mainImg.substring(65);
            mainImg.link = req.mainImg;
            const newMainImg = await imageRepository.save(mainImg);

            gathering.mainImg = newMainImg;
        }

        gathering.title = req.title;
        gathering.count = req.count;
        gathering.oncePrice = req.oncePrice;
        gathering.fullPrice = req.fullPrice;
        gathering.rangeDate = req.rangeDate;
        gathering.oneTimeDate = req.oneTimeDate;
        gathering.time = req.time;
        gathering.stringDate = req.stringDate;
        gathering.isAll = req.isAll;
        gathering.isOver = false;
        gathering.place = place;
        gathering.category = req.category;
        gathering.format = req.format;
        gathering.speaker = req.speaker;
        gathering.books = books;
        gathering.desc = req.desc;
        gathering.liveLink = req.liveLink;

        const savedGathering = await gatheringRepository.save(gathering);

        if (savedGathering) {
            ctx.status = 200;
            ctx.body = savedGathering;
        } else {
            ctx.status = 500;
        }
    }

    public static async createGatheringHistory(ctx: any, next: any) {
        const gatheringHistoryRepository: Repository<GatheringHistory> = getManager().getRepository(
            GatheringHistory,
        );
        const gatheringRepository: Repository<Gathering> = getManager().getRepository(Gathering);
        const userRepository: Repository<User> = getManager().getRepository(User);

        const req = ctx.request.body;
        const gathering: Gathering | any = await gatheringRepository.findOne({
            where: { id: req.gathering.id },
        });
        const user: User | undefined = await userRepository.findOne({
            where: { id: req.user.id },
        });

        const newHistory = new GatheringHistory();

        newHistory.orderNum = req.orderNum;
        newHistory.gathering = gathering;
        newHistory.user = user;
        newHistory.headCount = req.headCount;
        if (gathering.isAll) {
            const nextMonthDate = nextMonthWeekDay(gathering.stringDate);
            newHistory.date = nextMonthDate;
        }
        newHistory.purchaseDate = moment().format('YYYY[-]MM[-]DD');
        newHistory.creditUse = req.creditUse;
        newHistory.totalPrice = req.totalPrice;

        const savedHistory = await gatheringHistoryRepository.save(newHistory);

        if (savedHistory) {
            ctx.status = 200;
            ctx.body = savedHistory;
        } else {
            ctx.status = 500;
        }
    }

    public static async getGatherings(ctx: any, next: any) {
        try {
            //get a user repository to perform operations with user
            const gatheringRepository: Repository<Gathering> = getManager().getRepository(
                Gathering,
            );

            const req = ctx.request.body;

            const where: any = {};

            if (req.category !== undefined) where.category = req.category;
            if (req.isOver !== undefined) where.isOver = req.isOver;
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
        } catch (err) {
            console.log(err);
            ctx.status = 404;
        }
    }

    public static async getGatheringHistories(ctx: any, next: any) {
        try {
            //get a user repository to perform operations with user
            const gatheringHistoryRepository: Repository<GatheringHistory> = getManager().getRepository(
                GatheringHistory,
            );

            const req = ctx.request.body;

            const where: any = {};

            if (req.name !== undefined) where.name = req.name;

            let gatheringHistories: any = undefined;

            if (where.name) {
                gatheringHistories = await getManager()
                    .createQueryBuilder(GatheringHistory, 'gatheringHistory')
                    .innerJoinAndSelect('gatheringHistory.gathering', 'gathering')
                    .innerJoinAndSelect('gatheringHistory.user', 'user')
                    .innerJoinAndSelect('gathering.mainImg', 'mainImg')
                    .innerJoinAndSelect('gathering.place', 'place')
                    .where('user.name = :name', { name: where.name })
                    .orderBy('gatheringHistory.createdAt', 'ASC')
                    .skip((req.page - 1) * req.offset)
                    .take(req.offset)
                    .getMany();
            } else {
                gatheringHistories = await gatheringHistoryRepository.find({
                    join: {
                        alias: 'gatheringHistory',
                        leftJoinAndSelect: {
                            gathering: 'gatheringHistory.gathering',
                            mainImg: 'gathering.mainImg',
                            place: 'gathering.place',
                            user: 'gatheringHistory.user',
                        },
                    },
                    where: where,
                    order: { createdAt: 'ASC' },
                    skip: (req.page - 1) * req.offset,
                    take: req.offset,
                });
            }

            ctx.status = 200;
            if (gatheringHistories.length > 0) {
                ctx.body = gatheringHistories;
            }
        } catch (err) {
            console.log(err);
            ctx.status = 404;
        }
    }

    public static async cancelGatheringHistory(ctx: any) {
        const gatheringHistoryRepository: Repository<GatheringHistory> = getManager().getRepository(
            GatheringHistory,
        );

        const history: GatheringHistory | any = await gatheringHistoryRepository.findOne({
            join: {
                alias: 'GatheringHistory',
                leftJoinAndSelect: {
                    user: 'GatheringHistory.user',
                },
            },
            where: { id: ctx.params.id },
        });

        history.showUp = '예약 취소 대기중';

        const newHistory = gatheringHistoryRepository.save(history);

        if (newHistory) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = newHistory;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }

    public static async getGatheringHistoriesByUser(ctx: any, next: any) {
        try {
            //get a user repository to perform operations with user
            const gatheringHistoryRepository: Repository<GatheringHistory> = getManager().getRepository(
                GatheringHistory,
            );

            const req = ctx.request.body;

            const gatheringHistories = await getManager()
                .createQueryBuilder(GatheringHistory, 'gatheringHistory')
                .innerJoinAndSelect('gatheringHistory.gathering', 'gathering')
                .innerJoinAndSelect('gatheringHistory.user', 'user')
                .innerJoinAndSelect('gathering.mainImg', 'mainImg')
                .innerJoinAndSelect('gathering.place', 'place')
                .where('user.id = :id', { id: req.user.id })
                .orderBy('gatheringHistory.createdAt', 'ASC')
                .skip((req.page - 1) * req.offset)
                .take(req.offset)
                .getMany();

            ctx.status = 200;
            if (gatheringHistories.length > 0) {
                ctx.body = gatheringHistories;
            } else {
                ctx.body = '검색 결과가 없습니다.';
            }
        } catch (err) {
            console.log(err);
            ctx.status = 404;
        }
    }

    public static async getGatheringPeople(ctx: any, next: any) {
        try {
            const gatheringHistoryRepository: Repository<GatheringHistory> = getManager().getRepository(
                GatheringHistory,
            );

            const req = ctx.request.body;

            let gatheringHistories: any = undefined;

            if (!req.name) {
                gatheringHistories = await getManager()
                    .createQueryBuilder(GatheringHistory, 'gatheringHistory')
                    .innerJoinAndSelect('gatheringHistory.gathering', 'gathering')
                    .innerJoinAndSelect('gathering.mainImg', 'mainImg')
                    .innerJoinAndSelect('gathering.place', 'place')
                    .innerJoinAndSelect('gatheringHistory.user', 'user')
                    .where('gathering.id = :id', { id: req.id })
                    .orderBy('gathering.createdAt', 'ASC')
                    .skip((req.page - 1) * req.offset)
                    .take(req.offset)
                    .getMany();
            } else {
                gatheringHistories = await getManager()
                    .createQueryBuilder(GatheringHistory, 'gatheringHistory')
                    .innerJoinAndSelect('gatheringHistory.gathering', 'gathering')
                    .innerJoinAndSelect('gathering.mainImg', 'mainImg')
                    .innerJoinAndSelect('gathering.place', 'place')
                    .innerJoinAndSelect('gatheringHistory.user', 'user')
                    .where('gathering.id = :id', { id: req.id })
                    .andWhere('user.name = :name', { name: req.name })
                    .orderBy('gathering.createdAt', 'ASC')
                    .skip((req.page - 1) * req.offset)
                    .take(req.offset)
                    .getMany();
            }

            ctx.status = 200;
            if (gatheringHistories.length !== 0) {
                ctx.body = gatheringHistories;
            } else {
                ctx.body = 'not founded';
            }
        } catch (err) {
            console.log(err);
            ctx.status = 404;
        }
    }

    public static async updateShowUp(ctx: any, next: any) {
        try {
            const gatheringHistoryRepository: Repository<GatheringHistory> = getManager().getRepository(
                GatheringHistory,
            );

            const req = ctx.request.body;

            console.log(req);

            const gatheringHistory: any = await gatheringHistoryRepository.findOne({
                join: {
                    alias: 'gatheringHistory',
                    leftJoinAndSelect: {
                        user: 'gatheringHistory.user',
                        gathering: 'gatheringHistory.gathering',
                        mainImg: 'gathering.mainImg',
                        place: 'gathering.place',
                    },
                },
                where: { id: req.id },
            });

            gatheringHistory.showUp = req.status;

            const newHistory = await gatheringHistoryRepository.save(gatheringHistory);

            ctx.status = 200;
            ctx.body = newHistory;
        } catch (err) {
            console.log(err);
            ctx.status = 404;
        }
    }

    public static async getUpcomingGathering(ctx: any) {
        // get a user repository to perform operations with user
        const gatheringRepository: Repository<Gathering> = getManager().getRepository(Gathering);
        // load user by id

        const gathering: Gathering | undefined = await gatheringRepository.findOne({
            join: {
                alias: 'gathering',
                leftJoinAndSelect: {
                    mainImg: 'gathering.mainImg',
                    place: 'gathering.place',
                },
            },
            where: { isOver: false },
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

    public static async changeIsOver(ctx: any) {
        const gatheringRepository: Repository<Gathering> = getManager().getRepository(Gathering);
        // load user by id
        const gathering: Gathering | any = await gatheringRepository.findOne({
            where: { id: ctx.params.id },
        });

        gathering.isOver = !gathering.isOver;

        const newGathering = gatheringRepository.save(gathering);

        if (newGathering) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = newGathering;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }

    public static async deleteGathering(ctx: any, next: any) {
        try {
            const gatheringRepository: Repository<Gathering> = getManager().getRepository(
                Gathering,
            );
            const gathering: Gathering | undefined = await gatheringRepository.findOne({
                join: {
                    alias: 'gathering',
                    leftJoinAndSelect: {
                        mainImg: 'gathering.mainImg',
                        place: 'gathering.place',
                    },
                },
                where: { id: ctx.params.id },
            });

            if (gathering) {
                await gatheringRepository.remove(gathering);
                ctx.status = 204;
            } else {
                ctx.status = 400;
                ctx.body = "The place you are trying to delete doesn't exist in the db";
            }
        } catch (err) {
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                message: err.message,
            };
        }
        await next();
    }

    public static async getGatheringID(ctx: any) {
        // get a user repository to perform operations with user
        const gatheringRepository: Repository<Gathering> = getManager().getRepository(Gathering);
        // load user by id
        const gathering: Gathering | undefined = await gatheringRepository.findOne({
            join: {
                alias: 'gathering',
                leftJoinAndSelect: {
                    mainImg: 'gathering.mainImg',
                    place: 'gathering.place',
                    books: 'gathering.books',
                    booksMainImg: 'books.mainImg',
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

    public static async getThreeMonthsGathering(ctx: any) {
        // get a user repository to perform operations with user
        const gatheringRepository: Repository<Gathering> = getManager().getRepository(Gathering);
        // load user by id

        const upperDate = moment().add(2, 'months').format('YYYY-MM-DD');
        const lowerDate = moment().subtract(2, 'months').format('YYYY-MM-DD');

        const gathering: Gathering[] | any = await gatheringRepository.find({
            where: [
                { isAll: true, isOver: false },
                { oneTimeDate: Between(lowerDate, upperDate), isOver: false },
                {
                    rangeDate: Raw(
                        (alias) => `'(${lowerDate}, ${upperDate})'::daterange @> ${alias}`,
                    ),
                },
            ],
        });

        let events = [];

        for (const event of gathering) {
            if (event.isAll && !event.isOver) {
                const weekStr: any = event.stringDate.substring(3, 4);
                const dayStr: any = event.stringDate.substring(6, 7);
                const week: any = convertKorToWeekNum(weekStr);
                const day: any = convertKorToDayNum(dayStr);
                const targetDayObj = moment().subtract(2, 'months');
                const targetWeek = Math.ceil(targetDayObj.date() / 7);
                const targetDay = parseInt(targetDayObj.format('E'));
                let startDayObj =
                    week - targetWeek >= 0
                        ? targetDayObj.add((week - targetWeek) * 7, 'days')
                        : targetDayObj.subtract(Math.abs(week - targetWeek) * 7, 'days');
                startDayObj =
                    day - targetDay >= 0
                        ? targetDayObj.add(day - targetDay, 'days')
                        : targetDayObj.subtract(Math.abs(day - targetDay), 'days');
                const upperStamp = parseInt(moment().add(2, 'months').format('x'));

                let currentDay = startDayObj;
                while (parseInt(currentDay.format('x')) < upperStamp) {
                    events.push({
                        start: currentDay.format('YYYY-MM-DD'),
                        end: currentDay.format('YYYY-MM-DD'),
                        id: event.id,
                        title: event.title,
                    });

                    currentDay.add(1, 'months');
                    const currentWeek = Math.ceil(currentDay.date() / 7);
                    const currentDate = parseInt(currentDay.format('E'));

                    let tempDateObj =
                        week - currentWeek >= 0
                            ? currentDay.add((week - currentWeek) * 7, 'days')
                            : currentDay.subtract(Math.abs(week - currentWeek) * 7, 'days');
                    tempDateObj =
                        day - currentDate >= 0
                            ? currentDay.add(day - currentDate, 'days')
                            : currentDay.subtract(Math.abs(day - currentDate), 'days');
                    currentDay = tempDateObj;
                }
            } else if (event.oneTimeDate) {
                events.push({
                    start: event.oneTimeDate,
                    end: event.oneTimeDate,
                    id: event.id,
                    title: event.title,
                });
            } else {
                const dayFullStr = event.rangeDate;
                const dayStrs = rangeDateStr(dayFullStr);
                const startDayObj = moment(dayStrs.start, 'YYYY-MM-DD');
                const endStamp = parseInt(moment(dayStrs.end, 'YYYY-MM-DD').format('x'));

                let currentDay = startDayObj;
                while (parseInt(currentDay.format('x')) < endStamp) {
                    events.push({
                        start: currentDay.format('YYYY-MM-DD'),
                        end: currentDay.format('YYYY-MM-DD'),
                        id: event.id,
                        title: event.title,
                    });

                    currentDay.add(7, 'days');
                }
            }
        }

        if (events) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = events;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }

    public static async getGatheringOrderNum(ctx: any, next: any) {
        const gatheringHistoryRepository: Repository<GatheringHistory> = getManager().getRepository(
            GatheringHistory,
        );
        // load user by id
        const gatheringHistory:
            | GatheringHistory
            | undefined = await gatheringHistoryRepository.findOne({
            join: {
                alias: 'gatheringHistory',
                leftJoinAndSelect: {
                    user: 'gatheringHistory.user',
                    address: 'user.address',
                    gathering: 'gatheringHistory.gathering',
                    mainImg: 'gathering.mainImg',
                    place: 'gathering.place',
                    books: 'gathering.books',
                    booksMainImg: 'books.mainImg',
                },
            },
            where: { orderNum: ctx.request.body.orderNum },
        });

        if (gatheringHistory) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = gatheringHistory;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }
}
