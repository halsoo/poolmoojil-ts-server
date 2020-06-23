import { getManager, Repository, In } from 'typeorm';
import moment from 'moment';
import 'moment/locale/ko';

import { convertKorToDayNum, convertKorToWeekNum, rangeDateStr } from '../lib/util';

import { OrderHistory } from '../models/OrderHistory';
import { Book } from '../models/Book';
import { Good } from '../models/Good';
import { User } from '../models/User';

export default class OrderHistoryController {
    public static async createOrderHistory(ctx: any, next: any) {
        // get a user repository to perform operations with user
        const orderHistoryRepository: Repository<OrderHistory> = getManager().getRepository(
            OrderHistory,
        );
        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        const goodRepository: Repository<Good> = getManager().getRepository(Good);
        const userRepository: Repository<User> = getManager().getRepository(User);
        // build up entity OrderHistory to be saved
        const newOrderHistory: OrderHistory = new OrderHistory();
        const req = ctx.request.body;

        const user: any = await userRepository.findOne({
            where: { id: req.user.id },
        });
        newOrderHistory.user = user;
        newOrderHistory.orderNum = req.orderNum;
        newOrderHistory.name = req.name;
        newOrderHistory.zip = req.zip;
        newOrderHistory.addressA = req.addressA;
        newOrderHistory.addressB = req.addressB;
        newOrderHistory.phone = req.phone;
        newOrderHistory.cart = req.cart;
        newOrderHistory.transactionStatus = req.transactionStatus;
        newOrderHistory.creditUse = req.creditUse;
        newOrderHistory.shippingFee = req.shippingFee;
        newOrderHistory.totalPrice = req.totalPrice;

        let bookIDs = [];
        let goodIDs = [];
        for (const id in req.cart) {
            if (req.cart[id].category === 'book') bookIDs.push(id);
            else goodIDs.push(id);
        }

        if (bookIDs.length !== 0) {
            const books: Book[] = await bookRepository.find({
                where: { id: In(bookIDs) },
            });

            newOrderHistory.books = books;
        }

        if (goodIDs.length !== 0) {
            const goods: Good[] = await goodRepository.find({
                where: { id: In(goodIDs) },
            });

            newOrderHistory.goods = goods;
        }

        console.log(newOrderHistory);

        const orderHistory = await orderHistoryRepository.save(newOrderHistory);

        if (orderHistory) {
            ctx.status = 200;
            ctx.body = orderHistory;
        } else {
            ctx.status = 500;
        }
        // return CREATED status code and updated OrderHistory
    }

    public static async getOrderHistories(ctx: any, next: any) {
        try {
            //get a user repository to perform operations with user
            const OrderHistoryRepository: Repository<OrderHistory> = getManager().getRepository(
                OrderHistory,
            );

            const req = ctx.request.body;

            let orderHistories: any = [];

            if (req.name) {
                orderHistories = await getManager()
                    .createQueryBuilder(OrderHistory, 'orderHistory')
                    .innerJoinAndSelect('orderHistory.user', 'user')
                    .innerJoinAndSelect('orderHistory.books', 'book')
                    .innerJoinAndSelect('orderHistory.goods', 'good')
                    .where('user.name = :name', { name: req.name })
                    .orderBy('orderHistory.createdAt', 'ASC')
                    .skip((req.page - 1) * req.offset)
                    .take(req.offset)
                    .getMany();
            } else {
                orderHistories = await OrderHistoryRepository.find({
                    join: {
                        alias: 'orderHistory',
                        leftJoinAndSelect: {
                            user: 'orderHistory.user',
                            book: 'orderHistory.books',
                            good: 'orderHistory.goods',
                        },
                    },
                    order: { createdAt: 'ASC' },
                    skip: (req.page - 1) * req.offset,
                    take: req.offset,
                });
            }

            ctx.status = 200;
            ctx.body = orderHistories;
        } catch (err) {
            console.log(err);
            ctx.status = 404;
        }
    }

    public static async getOrderHistoriesByUser(ctx: any, next: any) {
        try {
            //get a user repository to perform operations with user
            const historyRepository: Repository<OrderHistory> = getManager().getRepository(
                OrderHistory,
            );

            const req = ctx.request.body;

            const histories = await getManager()
                .createQueryBuilder(OrderHistory, 'history')
                .leftJoinAndSelect('history.user', 'user')
                .where('user.id = :id', { id: req.user.id })
                .orderBy('history.createdAt', 'DESC')
                .skip((req.page - 1) * req.offset)
                .take(req.offset)
                .getMany();

            ctx.status = 200;
            if (histories.length > 0) {
                ctx.body = histories;
            } else {
                ctx.body = '검색 결과가 없습니다.';
            }
        } catch (err) {
            console.log(err);
            ctx.status = 404;
        }
    }

    public static async getOrderHistoryOrderNum(ctx: any) {
        // get a user repository to perform operations with user
        try {
            const OrderHistoryRepository: Repository<OrderHistory> = getManager().getRepository(
                OrderHistory,
            );
            // load user by id
            const orderHistory: OrderHistory | undefined = await OrderHistoryRepository.findOne({
                join: {
                    alias: 'OrderHistory',
                    leftJoinAndSelect: {
                        user: 'OrderHistory.user',
                        address: 'user.address',
                        books: 'OrderHistory.books',
                        bookMainImg: 'books.mainImg',
                        goods: 'OrderHistory.goods',
                        goodMainImg: 'goods.mainImg',
                    },
                },
                where: { orderNum: ctx.request.body.orderNum },
            });

            if (orderHistory) {
                // return OK status code and loaded user object
                ctx.status = 200;
                ctx.body = orderHistory;
            } else {
                // return a BAD REQUEST status code and error message
                ctx.status = 404;
            }
        } catch (err) {
            console.log(err);
        }
    }

    public static async changeTransactionStatus(ctx: any) {
        const orderHistoryRepository: Repository<OrderHistory> = getManager().getRepository(
            OrderHistory,
        );
        // load user by id
        const req = ctx.request.body;

        const history: OrderHistory | any = await orderHistoryRepository.findOne({
            join: {
                alias: 'OrderHistory',
                leftJoinAndSelect: {
                    user: 'OrderHistory.user',
                },
            },
            where: { id: req.id },
        });

        history.transactionStatus = req.status;

        const newHistory = orderHistoryRepository.save(history);

        if (newHistory) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = newHistory;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }

    public static async cancelOrder(ctx: any) {
        const orderHistoryRepository: Repository<OrderHistory> = getManager().getRepository(
            OrderHistory,
        );

        const history: OrderHistory | any = await orderHistoryRepository.findOne({
            join: {
                alias: 'OrderHistory',
                leftJoinAndSelect: {
                    user: 'OrderHistory.user',
                },
            },
            where: { orderNum: ctx.params.orderNum },
        });

        history.transactionStatus = '주문 취소 대기중';

        const newHistory = orderHistoryRepository.save(history);

        if (newHistory) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = newHistory;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }
}
