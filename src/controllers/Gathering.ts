import { BaseContext } from 'koa';
import { getManager, Repository, Like, Between, Raw } from 'typeorm';
import moment from 'moment';
import 'moment/locale/ko';

import { convertKorToDayNum, convertKorToWeekNum, rangeDateStr } from '../lib/util';

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

    public static async getUpcomingGathering(ctx: BaseContext) {
        // get a user repository to perform operations with user
        const gatheringRepository: Repository<Gathering> = getManager().getRepository(Gathering);
        // load user by id

        const gathering: Gathering = await gatheringRepository.findOne({
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

    public static async getGatheringID(ctx: BaseContext) {
        // get a user repository to perform operations with user
        const gatheringRepository: Repository<Gathering> = getManager().getRepository(Gathering);
        // load user by id
        const gathering: Gathering = await gatheringRepository.findOne({
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

    public static async getThreeMonthsGathering(ctx: BaseContext) {
        // get a user repository to perform operations with user
        const gatheringRepository: Repository<Gathering> = getManager().getRepository(Gathering);
        // load user by id

        const upperDate = moment().add(2, 'months').format('YYYY-MM-DD');
        const lowerDate = moment().subtract(2, 'months').format('YYYY-MM-DD');

        const gathering: Gathering[] = await gatheringRepository.find({
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
                const weekStr = event.stringDate.substring(3, 4);
                const dayStr = event.stringDate.substring(6, 7);
                const week = convertKorToWeekNum(weekStr);
                const day = convertKorToDayNum(dayStr);
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

    public static async test(ctx: BaseContext) {
        // get a user repository to perform operations with user
        const gatheringRepository: Repository<Gathering> = getManager().getRepository(Gathering);
        // load user by id
        const upperDate = moment().add(0, 'months').format('YYYY-MM-DD');

        const gathering: Gathering = await gatheringRepository.find({
            where: {
                rangeDate: Raw(
                    (alias) => `'(${lowerRange}, ${upperRange})'::daterange @> ${alias}`,
                ),
            },
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
