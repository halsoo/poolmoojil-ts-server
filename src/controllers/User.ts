const SECRET = process.env.SECRET_KEY;
import { BaseContext } from 'koa';
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

    public static async getUsers(ctx: BaseContext, next: any) {
        //get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load all users
        const users: User[] = await userRepository.find();
        // return OK status code and loaded users array
        ctx.status = 200;
        ctx.body = users;
    }

    public static async getUser(ctx: BaseContext) {
        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load user by id
        const user: User = await userRepository.findOne({ userID: ctx.params.id });
        console.log(user);
        if (user) {
            // return OK status code and loaded user object
            ctx.status = 208;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 200;
        }
    }
    public static async getEmail(ctx: BaseContext) {
        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load user by id
        const user: User = await userRepository.findOne({ email: ctx.params.email });
        console.log(user);
        if (user) {
            // return OK status code and loaded user object
            ctx.status = 208;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 200;
        }
    }
    public static async createUser(ctx: BaseContext) {
        // get a user repository to perform operations with user
        console.log('signup!!!!!');
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
        newUser.hashedPassword = await bcrypt.hash(ctx.request.body.password, 10);

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
    public static async updateUser(ctx: BaseContext) {
        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load the user by id
        const renewUser: User = await userRepository.findOne(ctx.params.id);
        // return a BAD REQUEST status code and error message if the user cannot be found
        if (!renewUser) {
            ctx.status = 400;
            ctx.body = "The user you are trying to retrieve doesn't exist in the db";
        }
        if (ctx.request.body.name) {
            renewUser.name = ctx.request.body.name;
        }
        if (ctx.request.body.email) {
            renewUser.email = ctx.request.body.email;
        }
        if (ctx.request.body.password) {
            renewUser.hashedPassword = await bcrypt.hash(ctx.request.body.password, SECRET);
        }
        // validate user entity
        const errors: ValidationError[] = await validate(renewUser); // errors is an array of validation errors
        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        } else if (!(await userRepository.findOne(renewUser.userID))) {
            // check if a user with the specified id exists
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The user you are trying to update doesn't exist in the db";
        } else if (
            await userRepository.findOne({
                id: Not(Equal(renewUser.userID)),
                email: renewUser.email,
            })
        ) {
            // return BAD REQUEST status code and email already exists error
            ctx.status = 400;
            ctx.body = 'The specified e-mail address already exists';
        } else {
            // save the user contained in the PUT body
            const user = await userRepository.save(renewUser);
            // return CREATED status code and updated user
            ctx.status = 201;
            ctx.body = user;
        }
    }
    public static async deleteUser(ctx: BaseContext) {
        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load the user by id
        const userToRemove: User = await userRepository.findOne(ctx.request.body.userID);
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

    public static async logIn(ctx: BaseContext) {
        const userRepository: Repository<User> = getManager().getRepository(User);
        // load user by id
        const target = ctx.request.body;
        const user: User = await userRepository.findOne({ userID: target.userID });
        console.log(user);
        if (user) {
            if (
                user.userID === target.userID &&
                (await bcrypt.compare(target.password, user.hashedPassword))
            ) {
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

    public static async logOut(ctx: BaseContext) {
        ctx.cookies.set('access_token', null, {
            maxAge: 0,
            httpOnly: true,
        });
        ctx.status = 204;
    }
}
