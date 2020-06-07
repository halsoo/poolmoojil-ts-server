import Router from 'koa-router';
import { apiRouter } from './api-router';

export const basicRouter = new Router();

basicRouter.get('/', (ctx: any, next) => {
    ctx.body = "it's alive!";
    next();
});
