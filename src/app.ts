require('dotenv').config();

import { postgresDB } from './databases/postgres-db';
import { apiRouter } from './routes/api-router';
import REACT_ROUTER_PATH from './routes/react-path';
import { jwtMiddleware } from './lib/token';

const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const cors = require('@koa/cors');
const koaStatic = require('koa-static');
const mount = require('koa-mount');

const app = new Koa();
const router = new Router();

const staticPages = new Koa();
staticPages.use(koaStatic(path.join(__dirname, '/frontend')));

app.use(async (ctx: any, next: any) => {
    let path = undefined;
    let og = ctx.request.path;
    if (
        og.substring(og.length - 13, og.length - 12) === '-' &&
        og.substring(og.length - 18, og.length - 17) === '-' &&
        og.substring(og.length - 23, og.length - 22) === '-' &&
        og.substring(og.length - 28, og.length - 27) === '-' &&
        og.substring(0, 4) !== '/api'
    ) {
        path = og.substring(og.length - 36, 0);
    } else if (
        og.substring(og.length - 14, og.length - 13) === '_' &&
        og.substring(0, 4) !== '/api'
    ) {
        path = og.substring(og.lastIndexOf('/') + 1, 0);
    } else {
        path = og;
    }
    if (REACT_ROUTER_PATH.includes(path)) {
        ctx.request.path = '/';
    }
    await next();
});

app.use(mount('/', staticPages));

const PORT = process.env.PORT || 3000;

const corsOptions = {
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser());

app.use(jwtMiddleware);

router.use('/api', apiRouter.routes());

app.use(router.routes(), router.allowedMethods());

const bootstrap = async () => {
    await postgresDB();
};

bootstrap();

app.listen(PORT);
