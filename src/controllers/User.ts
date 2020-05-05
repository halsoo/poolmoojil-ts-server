const SECRET = process.env.SECRET_KEY;
import { BaseContext } from 'koa';
import bcrypt from 'bcrypt';
import { getManager, Repository, Not, Equal } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { generateToken } from '../lib/token';
import { User } from '../models/User';

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
        if (user) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = user;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The user you are trying to retrieve doesn't exist in the db";
        }
    }
    public static async createUser(ctx: BaseContext) {
        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);

        // build up entity user to be saved
        const newUser: User = new User();

        newUser.userID = ctx.request.body.userID;
        newUser.name = ctx.request.body.name;
        newUser.email = ctx.request.body.email;
        newUser.hashedPassword = await bcrypt.hash(ctx.request.body.password, SECRET);
        //validate(ctx.request.body.name);
        // validate user entity
        const errors: ValidationError[] = await validate(newUser, { skipMissingProperties: true }); // errors is an array of validation errors
        if (errors.length > 0) {
            // return BAD request status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        } else if (await userRepository.findOne({ email: newUser.email, userID: newUser.userID })) {
            // return BAD request status code and email already exists error
            ctx.status = 400;
            ctx.body = 'The specified e-mail and userID already exists';
        } else {
            // save the user contained in the POST body
            const user = await userRepository.save(newUser);

            let token = null;
            try {
                token = await UserController.token(newUser);
            } catch (error) {
                ctx.throw(500, error);
            }
            // return CREATED status code and updated user

            ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
            ctx.status = 201;
            ctx.body = user;
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
        const userToRemove: User = await userRepository.findOne(ctx.params.userID);
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
        console.log(target);
        const user: User = await userRepository.findOne({ userID: target.userID });

        if (user) {
            if (
                user.userID === target.userID &&
                user.hashedPassword === target.password //bcrypt.hash(target.password, SECRET)
            ) {
                let token = null;
                try {
                    token = await UserController.token(user);
                } catch (error) {
                    ctx.throw(500, error);
                }

                ctx.cookies.set('access_token', token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24,
                });

                ctx.redirect('/');
                return;
            } else {
                ctx.status = 400;
                ctx.body = '아이디 또는 비밀번호를 확인해주세요.';
            }
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = '일치하는 회원 정보가 없습니다.';
        }
    }

    public static async logOut() {
        ctx.cookies.set('access_token', null, {
            maxAge: 0,
            httpOnly: true,
        });
        ctx.status = 204;
    }
}
