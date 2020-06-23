import { getManager, Repository, Between } from 'typeorm';

import { User } from '../models/User';
import { Package } from '../models/Package';
import { PackageSubsc } from '../models/PackageSubsc';
import { PackageHistory } from '../models/PackageHistory';
import { Image } from '../models/Image';
import { MonthlyCuration } from '../models/MonthlyCuration';

import moment from 'moment';
import 'moment/locale/ko';

export default class PackageController {
    public static async createPackage(ctx: any, next: any) {
        const packageRepository: Repository<Package> = getManager().getRepository(Package);
        const monthlyCurationRepository: Repository<MonthlyCuration> = getManager().getRepository(
            MonthlyCuration,
        );
        const imageRepository: Repository<Image> = getManager().getRepository(Image);

        const req = ctx.request.body;

        const monthlyCurated: MonthlyCuration | any = await getManager()
            .createQueryBuilder(MonthlyCuration, 'monthlyCuration')
            .innerJoinAndSelect('monthlyCuration.book', 'book')
            .where('book.title = :title', { title: req.monthlyCurated })
            .getOne();

        const newPackage = new Package();

        const mainImg = new Image();
        mainImg.name = req.mainImg.substring(65);
        mainImg.link = req.mainImg;
        const newMainImg = await imageRepository.save(mainImg);

        newPackage.mainImg = newMainImg;
        newPackage.title = req.title;
        newPackage.outOfStock = false;
        newPackage.price = req.price;
        newPackage.date = req.date;
        newPackage.monthlyCurated = monthlyCurated;
        newPackage.desc = req.desc;
        newPackage.packageList = req.packageList;

        const savedPackage = await packageRepository.save(newPackage);

        if (savedPackage) {
            ctx.status = 200;
            ctx.body = savedPackage;
        } else {
            ctx.status = 500;
        }
    }

    public static async updatePackage(ctx: any, next: any) {
        const packageRepository: Repository<Package> = getManager().getRepository(Package);
        const imageRepository: Repository<Image> = getManager().getRepository(Image);

        const req = ctx.request.body;

        const oldPackage: Package | any = await packageRepository.findOne({
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
            where: { id: req.id },
        });

        console.log(oldPackage);

        if (req.mainImg) {
            const oldImage: any = await imageRepository.findOne({
                where: { id: oldPackage.mainImg.id },
            });
            await imageRepository.remove(oldImage);

            const mainImg = new Image();
            mainImg.name = req.mainImg.substring(65);
            mainImg.link = req.mainImg;
            const newMainImg = await imageRepository.save(mainImg);

            oldPackage.mainImg = newMainImg;
        }

        oldPackage.title = req.title;
        oldPackage.price = req.price;
        oldPackage.desc = req.desc;
        oldPackage.packageList = req.packageList;

        const savedPackage = await packageRepository.save(oldPackage);

        if (savedPackage) {
            ctx.status = 200;
            ctx.body = savedPackage;
        } else {
            ctx.status = 500;
        }
    }

    public static async getPackages(ctx: any, next: any) {
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
                join: {
                    alias: 'package',
                    leftJoinAndSelect: {
                        mainImg: 'package.mainImg',
                        monthlyCurated: 'package.monthlyCurated',
                        monthlyBook: 'monthlyCurated.book',
                        bookList: 'package.bookList',
                        bookMainImg: 'bookList.mainImg',
                        bookAddtionalImg: 'bookList.additionalImg',
                        goodList: 'package.goodList',
                        goodMainImg: 'goodList.mainImg',
                        goodAddtionalImg: 'goodList.additionalImg',
                        packageHistories: 'package.packageHistories',
                    },
                },
                order: { date: 'DESC' },
                skip: (req.page - 1) * req.offset,
                take: req.offset,
            });

            ctx.status = 200;
            ctx.body = packages;
        } catch {
            ctx.status = 404;
        }
    }

    public static async getPackageID(ctx: any) {
        // get a user repository to perform operations with user
        const packageRepository: Repository<Package> = getManager().getRepository(Package);
        // load user by id
        const singlePackage: Package | undefined = await packageRepository.findOne({
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

    public static async changeOutOfStock(ctx: any) {
        const packageRepository: Repository<Package> = getManager().getRepository(Package);
        // load user by id
        const singlePackage: Package | any = await packageRepository.findOne({
            where: { id: ctx.params.id },
        });

        singlePackage.outOfStock = !singlePackage.outOfStock;

        const newpackage = packageRepository.save(singlePackage);

        if (newpackage) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = newpackage;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }

    public static async deletePackage(ctx: any, next: any) {
        try {
            const packageRepository: Repository<Package> = getManager().getRepository(Package);
            const singlePackage: Package | undefined = await packageRepository.findOne({
                join: {
                    alias: 'package',
                    leftJoinAndSelect: {
                        mainImg: 'package.mainImg',
                        monthlyCurated: 'package.monthlyCurated',
                        bookList: 'package.bookList',
                        bookMainImg: 'bookList.mainImg',
                        bookAddtionalImg: 'bookList.additionalImg',
                        goodList: 'package.goodList',
                        goodMainImg: 'goodList.mainImg',
                        goodAddtionalImg: 'goodList.additionalImg',
                        packageHistories: 'package.packageHistories',
                    },
                },
                where: { id: ctx.params.id },
            });

            if (singlePackage) {
                await packageRepository.remove(singlePackage);
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
            console.log(err);
        }
        await next();
    }

    public static async getPackageMonthly(ctx: any) {
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
        const singlePackage: Package | undefined = await packageRepository.findOne({
            join: {
                alias: 'package',
                leftJoinAndSelect: {
                    mainImg: 'package.mainImg',
                    monthlyCurated: 'package.monthlyCurated',
                    monthlyBook: 'monthlyCurated.book',
                    bookList: 'package.bookList',
                    bookMainImg: 'bookList.mainImg',
                    bookAddtionalImg: 'bookList.additionalImg',
                    goodList: 'package.goodList',
                    goodMainImg: 'goodList.mainImg',
                    goodAddtionalImg: 'goodList.additionalImg',
                    packageHistories: 'package.packageHistories',
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

    public static async createPackageHistory(ctx: any, next: any) {
        // get a user repository to perform operations with user
        const packageHistoryRepository: Repository<PackageHistory> = getManager().getRepository(
            PackageHistory,
        );
        const packageRepository: Repository<Package> = getManager().getRepository(Package);
        const userRepository: Repository<User> = getManager().getRepository(User);
        // build up entity packageHistory to be saved
        const newpackageHistory: PackageHistory = new PackageHistory();
        const req = ctx.request.body;

        const user: any = await userRepository.findOne({
            where: { id: req.user.id },
        });
        const singlePackage: any = await packageRepository.findOne({
            where: { id: req.package.id },
        });

        newpackageHistory.user = user;
        newpackageHistory.package = singlePackage;
        newpackageHistory.purchaseDate = moment().format('YYYY[-]MM[-]DD');

        newpackageHistory.isSubsc = false;
        newpackageHistory.orderNum = req.orderNum;
        newpackageHistory.name = req.name;
        newpackageHistory.zip = req.zip;
        newpackageHistory.addressA = req.addressA;
        newpackageHistory.addressB = req.addressB;
        newpackageHistory.phone = req.phone;
        newpackageHistory.transactionStatus = req.transactionStatus;
        newpackageHistory.creditUse = req.creditUse;
        newpackageHistory.shippingFee = req.shippingFee;
        newpackageHistory.totalPrice = req.totalPrice;

        console.log(newpackageHistory);

        const packageHistory = await packageHistoryRepository.save(newpackageHistory);

        if (packageHistory) {
            ctx.status = 200;
            ctx.body = packageHistory;
        } else {
            ctx.status = 500;
        }
        // return CREATED status code and updated OrderHistory
    }

    public static async cancelPackageHistory(ctx: any) {
        const historyRepository: Repository<PackageHistory> = getManager().getRepository(
            PackageHistory,
        );

        const history: PackageHistory | any = await historyRepository.findOne({
            join: {
                alias: 'PakcageHistory',
                leftJoinAndSelect: {
                    user: 'PakcageHistory.user',
                },
            },
            where: { id: ctx.params.id },
        });

        history.transactionStatus = '주문 취소 대기중';

        const newHistory = historyRepository.save(history);

        if (newHistory) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = newHistory;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }

    public static async getPackageHistories(ctx: any) {
        // get a user repository to perform operations with user
        const PackageHistoryRepository: Repository<PackageHistory> = getManager().getRepository(
            PackageHistory,
        );
        const req = ctx.request.body;
        // load user by id
        let packageHistories: any = undefined;

        if (req.name) {
            packageHistories = await getManager()
                .createQueryBuilder(PackageHistory, 'packageHistory')
                .leftJoinAndSelect('packageHistory.package', 'package')
                .leftJoinAndSelect('packageHistory.user', 'user')
                .leftJoinAndSelect('user.address', 'address')
                .where('user.name = :name', { name: req.name })
                .orderBy('packageHistory.purchaseDate', 'DESC')
                .skip((req.page - 1) * req.offset)
                .take(req.offset)
                .getMany();
        } else {
            packageHistories = await PackageHistoryRepository.find({
                join: {
                    alias: 'PackageHistory',
                    leftJoinAndSelect: {
                        user: 'PackageHistory.user',
                        address: 'user.address',
                        package: 'PackageHistory.package',
                    },
                },
                order: { purchaseDate: 'DESC' },
                skip: (req.page - 1) * req.offset,
                take: req.offset,
            });
        }

        ctx.status = 200;
        if (packageHistories.length !== 0) {
            // return OK status code and loaded user object

            ctx.body = packageHistories;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.body = 'not founded';
        }
    }

    public static async getPackageHistoriesByUser(ctx: any, next: any) {
        try {
            //get a user repository to perform operations with user
            const historyRepository: Repository<PackageHistory> = getManager().getRepository(
                PackageHistory,
            );

            const req = ctx.request.body;

            const histories = await getManager()
                .createQueryBuilder(PackageHistory, 'history')
                .leftJoinAndSelect('history.package', 'package')
                .leftJoinAndSelect('history.user', 'user')
                .where('user.id = :id', { id: req.user.id })
                .orderBy('history.purchaseDate', 'DESC')
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

    public static async getPackageHistoryOrderNum(ctx: any) {
        // get a user repository to perform operations with user
        const PackageHistoryRepository: Repository<PackageHistory> = getManager().getRepository(
            PackageHistory,
        );
        // load user by id
        const packageHistory: PackageHistory | undefined = await PackageHistoryRepository.findOne({
            join: {
                alias: 'PackageHistory',
                leftJoinAndSelect: {
                    user: 'PackageHistory.user',
                    address: 'user.address',
                    singlePackage: 'PackageHistory.package',
                },
            },
            where: { orderNum: ctx.request.body.orderNum },
        });

        if (packageHistory) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = packageHistory;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }

    public static async getPackageHistoryID(ctx: any) {
        // get a user repository to perform operations with user
        const PackageHistoryRepository: Repository<PackageHistory> = getManager().getRepository(
            PackageHistory,
        );
        // load user by id
        const packageHistory: PackageHistory | undefined = await PackageHistoryRepository.findOne({
            join: {
                alias: 'PackageHistory',
                leftJoinAndSelect: {
                    user: 'PackageHistory.user',
                    address: 'user.address',
                    singlePackage: 'PackageHistory.package',
                },
            },
            where: { id: ctx.request.body.id },
        });

        if (packageHistory) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = packageHistory;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }

    public static async changeTransactionHistory(ctx: any) {
        const packageHistoryRepository: Repository<PackageHistory> = getManager().getRepository(
            PackageHistory,
        );
        // load user by id
        const req = ctx.request.body;

        const history: PackageHistory | any = await packageHistoryRepository.findOne({
            where: { id: req.id },
        });

        history.transactionStatus = req.status;

        const newHistory = packageHistoryRepository.save(history);

        if (newHistory) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = newHistory;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }

    public static async updatePackageInfo(ctx: any) {
        const packageRepository: Repository<Package> = getManager().getRepository(Package);
        const packageHistoryRepository: Repository<PackageHistory> = getManager().getRepository(
            PackageHistory,
        );
        // load user by id
        const req = ctx.request.body;

        const newPackage: Package | any = await packageRepository.findOne({
            where: { title: req.title },
        });

        const history: PackageHistory | any = await packageHistoryRepository.findOne({
            where: { id: req.id },
        });

        history.package = newPackage;

        const newHistory = packageHistoryRepository.save(history);

        if (newHistory) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = newHistory;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }

    public static async createPackageSubsc(ctx: any, next: any) {
        // get a user repository to perform operations with user
        const packageSubscRepository: Repository<PackageSubsc> = getManager().getRepository(
            PackageSubsc,
        );
        const packageRepository: Repository<Package> = getManager().getRepository(Package);
        const packageHistoryRepository: Repository<PackageHistory> = getManager().getRepository(
            PackageHistory,
        );
        const userRepository: Repository<User> = getManager().getRepository(User);
        // build up entity packageSubsc to be saved
        const newpackageSubsc: PackageSubsc = new PackageSubsc();
        const req = ctx.request.body;

        const user: any = await userRepository.findOne({
            where: { id: req.user.id },
        });
        const singlePackage: any = await packageRepository.findOne({
            where: { id: req.package.id },
        });

        newpackageSubsc.user = user;
        newpackageSubsc.subscStatus = '구독중';
        newpackageSubsc.packagePeriod =
            '[' +
            moment().format('YYYY[-]MM[-]DD') +
            ',' +
            moment().add(3, 'months').format('YYYY[-]MM[-]DD') +
            ')';

        newpackageSubsc.orderNum = req.orderNum;
        newpackageSubsc.name = req.name;
        newpackageSubsc.zip = req.zip;
        newpackageSubsc.addressA = req.addressA;
        newpackageSubsc.addressB = req.addressB;
        newpackageSubsc.phone = req.phone;
        newpackageSubsc.transactionStatus = req.transactionStatus;
        newpackageSubsc.creditUse = req.creditUse;
        newpackageSubsc.totalPrice = req.totalPrice;
        let packageHistories = [];

        for (let i = 0; i < 3; i++) {
            const newHistory = new PackageHistory();
            newHistory.user = user;
            if (i === 0) newHistory.package = singlePackage;
            newHistory.purchaseDate = moment()
                .add(i + 1, 'months')
                .format('YYYY[-]MM[-]DD');

            newHistory.isSubsc = true;
            newHistory.orderNum = req.orderNum;
            newHistory.name = req.name;
            newHistory.zip = req.zip;
            newHistory.addressA = req.addressA;
            newHistory.addressB = req.addressB;
            newHistory.phone = req.phone;
            newHistory.transactionStatus = req.transactionStatus;
            newHistory.creditUse = req.creditUse;
            newHistory.shippingFee = req.shippingFee;
            newHistory.totalPrice = req.totalPrice;

            const history = await packageHistoryRepository.save(newHistory);
            packageHistories.push(history);
        }

        newpackageSubsc.packageHistories = packageHistories;

        console.log(newpackageSubsc);

        const packageSubsc = await packageSubscRepository.save(newpackageSubsc);

        if (packageSubsc) {
            ctx.status = 200;
            ctx.body = packageSubsc;
        } else {
            ctx.status = 500;
        }
        // return CREATED status code and updated OrderSubsc
    }

    public static async getPackageSubscs(ctx: any) {
        // get a user repository to perform operations with user
        const PackageSubscRepository: Repository<PackageSubsc> = getManager().getRepository(
            PackageSubsc,
        );
        const req = ctx.request.body;
        // load user by id
        let packageSubscs: any = undefined;

        if (req.name) {
            packageSubscs = await getManager()
                .createQueryBuilder(PackageSubsc, 'packageSubsc')
                .innerJoinAndSelect('packageSubsc.packageHistories', 'packageHistories')
                .innerJoinAndSelect('packageSubsc.user', 'user')
                .innerJoinAndSelect('user.address', 'address')
                .where('user.name = :name', { name: req.name })
                .orderBy('packageSubsc.createdAt', 'ASC')
                .skip((req.page - 1) * req.offset)
                .take(req.offset)
                .getMany();
        } else {
            packageSubscs = await PackageSubscRepository.find({
                join: {
                    alias: 'PackageSubsc',
                    leftJoinAndSelect: {
                        user: 'PackageSubsc.user',
                        address: 'user.address',
                        packageHistories: 'PackageSubsc.packageHistories',
                    },
                },
                order: { createdAt: 'ASC' },
                skip: (req.page - 1) * req.offset,
                take: req.offset,
            });
        }

        ctx.status = 200;
        if (packageSubscs.length !== 0) {
            ctx.body = packageSubscs;
        } else {
            ctx.body = 'not founded';
        }
    }

    public static async getPackageSubscOrderNum(ctx: any) {
        // get a user repository to perform operations with user
        const PackageSubscRepository: Repository<PackageSubsc> = getManager().getRepository(
            PackageSubsc,
        );
        console.log(ctx.request.body.orderNum);
        // load user by id
        const packageSubsc: PackageSubsc | undefined = await PackageSubscRepository.findOne({
            join: {
                alias: 'PackageSubsc',
                leftJoinAndSelect: {
                    user: 'PackageSubsc.user',
                    address: 'user.address',
                },
            },
            where: { orderNum: ctx.request.body.orderNum },
        });

        if (packageSubsc) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = packageSubsc;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }

    public static async getPackageSubscID(ctx: any) {
        // get a user repository to perform operations with user
        const PackageSubscRepository: Repository<PackageSubsc> = getManager().getRepository(
            PackageSubsc,
        );
        // load user by id
        const packageSubsc: PackageSubsc | undefined = await PackageSubscRepository.findOne({
            join: {
                alias: 'PackageSubsc',
                leftJoinAndSelect: {
                    user: 'PackageSubsc.user',
                    address: 'user.address',
                    packageHistories: 'PackageSubsc.packageHistories',
                    package: 'packageHistories.package',
                },
            },
            where: { id: ctx.request.body.id },
        });

        if (packageSubsc) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = packageSubsc;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }

    public static async changeSubscStatus(ctx: any) {
        const packageSubscRepository: Repository<PackageSubsc> = getManager().getRepository(
            PackageSubsc,
        );
        const packageHistoryRepository: Repository<PackageHistory> = getManager().getRepository(
            PackageHistory,
        );
        // load user by id
        const req = ctx.request.body;

        const subsc: PackageSubsc | any = await packageSubscRepository.findOne({
            join: {
                alias: 'PackageSubsc',
                leftJoinAndSelect: {
                    packageHistories: 'PackageSubsc.packageHistories',
                    package: 'packageHistories.package',
                },
            },
            where: { id: req.id },
        });

        subsc.subscStatus = req.status;

        let newHistories = [];

        if (req.status === '구독취소') {
            for (const history of subsc.packageHistories) {
                history.transactionStatus = '주문 취소';
                const newHistory = await packageHistoryRepository.save(history);
            }
        }

        const newSubsc = await packageSubscRepository.save(subsc);

        if (newSubsc) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = newSubsc;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 404;
        }
    }
}
