import Router from 'koa-router';
import { apiRouter } from './api-router';

export const basicRouter = new Router();

basicRouter.use('api', apiRouter.routes());
