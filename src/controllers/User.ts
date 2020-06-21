const SECRET: any = process.env.SECRET_KEY;
const Cookies = require('cookies');
import bcrypt from 'bcrypt';
import { getManager, Repository, Not, Equal } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { generateToken } from '../lib/token';
import { User } from '../models/User';
import { Address } from '../models/Address';

export default class UserController {
    public static async token(User: User) {
        const payload = {
            id: User.id,
            userID: User.userID,
            email: User.email,
        };

        return generateToken(payload);
    }

    public static async admin(User: User) {
        const payload = {
            id: User.id,
            userID: User.userID,
        };

        return generateToken(payload);
    }

    public static async getUsers(ctx: any, next: any) {
        //get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load all users
        const users: User[] = await userRepository.find();
        // return OK status code and loaded users array
        ctx.status = 200;
        ctx.body = users;
    }

    public static async getUserCookie(ctx: any, next: any) {
        //get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load all users
        const user: User | undefined = await userRepository.findOne({
            join: {
                alias: 'user',
                leftJoinAndSelect: {
                    address: 'user.address',
                    orderHistories: 'user.orderHistories',
                    orderBooks: 'orderHistories.books',
                    orderGoods: 'orderHistories.goods',
                    orderBooksMainImg: 'orderBooks.mainImg',
                    orderGoodsMainImg: 'orderGoods.mainImg',
                    packageHistories: 'user.packageHistories',
                    historyPackage: 'packageHistories.package',
                    historyPackageMainImg: 'historyPackage.mainImg',
                    packageSubscs: 'user.packageSubscs',
                    gatheringHistories: 'user.gatheringHistories',
                    historyGathering: 'gatheringHistories.gathering',
                    historyGatheringMainImg: 'historyGathering.mainImg',
                },
            },
            where: { id: ctx.request.user.id },
        });
        // return OK status code and loaded users array
        ctx.status = 200;
        ctx.body = user;
    }

    public static async getUser(ctx: any) {
        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load user by id
        const user: User | undefined = await userRepository.findOne({ userID: ctx.params.id });

        if (user) {
            // return OK status code and loaded user object
            ctx.status = 208;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 200;
        }
    }
    public static async getEmail(ctx: any) {
        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load user by id
        const user: User | undefined = await userRepository.findOne({ email: ctx.params.email });

        if (user) {
            // return OK status code and loaded user object
            ctx.status = 208;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 200;
        }
    }
    public static async createUser(ctx: any) {
        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        const addressRepository: Repository<Address> = getManager().getRepository(Address);
        // build up entity user to be saved
        const newUser: User = new User();
        const newAddress: Address = new Address();

        newUser.userID = ctx.request.body.userID;
        newUser.name = ctx.request.body.name;
        newUser.email = ctx.request.body.email;
        newUser.phone = ctx.request.body.phone;
        newUser.birth = ctx.request.body.birth;
        newUser.credit = 0;
        newUser.hashedPassword = await bcrypt.hash(ctx.request.body.password, 10);
        newUser.newsLetter = ctx.request.body.newsLetter ? true : false;

        newAddress.user = newUser;
        newAddress.name = '기본';
        newAddress.zip = ctx.request.body.zipCode;
        newAddress.addressA = ctx.request.body.addressA;
        newAddress.addressB = ctx.request.body.addressB;

        newUser.address = [newAddress];
        //validate(ctx.request.body.name);
        // validate user entity
        const UserErrors: ValidationError[] = await validate(newUser, {
            skipMissingProperties: true,
        }); // errors is an array of validation errors
        const AddressErrors: ValidationError[] = await validate(newAddress, {
            skipMissingProperties: true,
        }); // errors is an array of validation errors

        if (UserErrors.length > 0 || AddressErrors.length > 0) {
            // return BAD request status code and errors array
            ctx.status = 400;
        } else {
            // save the user contained in the POST body
            const user = await userRepository.save(newUser);
            const address = await addressRepository.save(newAddress);

            let token = null;
            try {
                token = await UserController.token(user);
            } catch (error) {
                ctx.throw(500, error);
            }
            // return CREATED status code and updated user

            ctx.cookies.set('access_token', token, {
                httpOnly: false,
                sign: true,
                maxAge: 1000 * 60 * 60 * 24,
            });
            ctx.status = 201;
        }
    }

    public static async updateUser(ctx: any) {
        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        const addressRepository: Repository<Address> = getManager().getRepository(Address);
        // load the user by id
        const renewUser: any = await userRepository.findOne({
            join: {
                alias: 'user',
                leftJoinAndSelect: {
                    address: 'user.address',
                },
            },
            where: { id: ctx.request.user.id },
        });

        const oldAddress: any = await addressRepository.findOne({
            join: {
                alias: 'address',
                leftJoinAndSelect: {
                    user: 'address.user',
                },
            },
            where: { userId: renewUser.id },
        });

        await addressRepository.remove(oldAddress);
        const newAddress: Address = new Address();
        // return a BAD REQUEST status code and error message if the user cannot be found
        if (!renewUser) {
            ctx.status = 400;
            ctx.body = "The user you are trying to retrieve doesn't exist in the db";
        }
        if (ctx.request.body.password) {
            renewUser.hashedPassword = await bcrypt.hash(ctx.request.body.password, 10);
        }

        if (ctx.request.body.phone) {
            renewUser.phone = ctx.request.body.phone;
        }

        if (ctx.request.body.birth) {
            renewUser.birth = ctx.request.body.birth;
        }

        if (ctx.request.body.newsLetter !== undefined) {
            renewUser.newsLetter = ctx.request.body.newsLetter;
        }

        if (ctx.request.body.zipCode && ctx.request.body.addressA && ctx.request.body.addressB) {
            newAddress.user = renewUser;
            newAddress.name = '기본';
            newAddress.zip = ctx.request.body.zipCode;
            newAddress.addressA = ctx.request.body.addressA;
            newAddress.addressB = ctx.request.body.addressB;
        }
        // validate user entity
        const errors: ValidationError[] = await validate(renewUser); // errors is an array of validation errors
        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        } else {
            if (newAddress.user === renewUser) {
                console.log('update address');
                renewUser.address = [newAddress];
                await addressRepository.save(newAddress);
                await userRepository.save(renewUser);
            } else {
                console.log('solo save process');
                await userRepository.save(renewUser);
            }

            // return CREATED status code and updated user
            ctx.status = 201;
        }
    }
    public static async deleteUser(ctx: any) {
        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load the user by id
        const userToRemove: User | undefined = await userRepository.findOne(
            ctx.request.body.userID,
        );
        if (!userToRemove) {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The user you are trying to delete doesn't exist in the db";
        } else {
            // the user is there so can be removed
            await userRepository.remove(userToRemove);
            // return a NO CONTENT status code
            ctx.status = 204;
        }
    }

    public static async logIn(ctx: any) {
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load user by id
        const target = ctx.request.body;
        const user: User | any = await userRepository.findOne({
            select: ['id', 'isAdmin', 'email', 'userID', 'hashedPassword'],
            where: { userID: target.userID },
        });
        if (user) {
            if (
                user.userID === target.userID &&
                (await bcrypt.compare(target.password, user.hashedPassword))
            ) {
                if (user.isAdmin) {
                    let admin = null;
                    try {
                        admin = await UserController.token(user);
                    } catch (error) {
                        ctx.status = 500;
                    }

                    ctx.cookies.set('admin_token', admin, {
                        httpOnly: false,
                        sign: true,
                        maxAge: 1000 * 60 * 60 * 24,
                    });
                }

                let token = null;
                try {
                    token = await UserController.token(user);
                } catch (error) {
                    ctx.status = 500;
                }

                ctx.cookies.set('access_token', token, {
                    httpOnly: false,
                    sign: true,
                    maxAge: 1000 * 60 * 60 * 24,
                });

                ctx.status = 202;
            } else {
                ctx.status = 400;
            }
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
        }
    }

    public static async logOut(ctx: any) {
        ctx.cookies.set('access_token', null, {
            maxAge: 0,
            httpOnly: true,
        });

        ctx.cookies.set('admin_token', null, {
            httpOnly: false,
            maxAge: 0,
        });

        ctx.status = 204;
    }

    public static async cartIn(ctx: any, next: any) {
        //get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load all users
        const user: User | any = await userRepository.findOne({
            where: { id: ctx.request.user.id },
        });

        if (user.cart === null) {
            user.cart = {};
        }

        user.cart[ctx.request.body.id] = {
            quantity: ctx.request.body.quantity,
            category: ctx.request.body.category,
        };

        const savedUser = await userRepository.save(user);
        // return OK status code and loaded users array

        ctx.status = 200;
    }

    public static async cartOut(ctx: any, next: any) {
        //get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load all users
        const user: User | any = await userRepository.findOne({
            where: { id: ctx.request.user.id },
        });

        const userCart = user.cart;

        delete userCart[ctx.request.body.id];

        user.cart = { ...userCart };

        const savedUser = await userRepository.save(user);
        // return OK status code and loaded users array
        ctx.status = 200;
    }

    public static async cartClear(ctx: any, next: any) {
        //get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load all users
        const user: User | any = await userRepository.findOne({
            where: { id: ctx.request.user.id },
        });

        const userCart = {};

        user.cart = { ...userCart };

        const savedUser = await userRepository.save(user);
        // return OK status code and loaded users array
        ctx.status = 200;
    }

    public static async getCart(ctx: any, next: any) {
        //get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load all users
        const user: User | any = await userRepository.findOne({
            where: { id: ctx.request.user.id },
        });
        // return OK status code and loaded users array
        ctx.status = 200;
        ctx.body = user.cart;
    }
}
