import { postgresDB } from './databases/postgres-db';
import { apiRouter } from './routes/api-router';
import REACT_ROUTER_PATH from './routes/react-path';

const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const Logger = require('koa-logger');
const cors = require('koa-cors');
const koaStatic = require('koa-static');
const mount = require('koa-mount');

const app = new Koa();
const router = new Router();

const staticPages = new Koa();
staticPages.use(koaStatic(path.join(__dirname, '../', '/client/build')));

app.use(async (ctx, next) => {
    if (REACT_ROUTER_PATH.includes(ctx.request.path)) {
        ctx.request.path = '/';
    }
    await next();
});
app.use(mount('/', staticPages));

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser());

router.use('/api', apiRouter.routes());

app.use(router.routes(), router.allowedMethods());

const bootstrap = async () => {
    await postgresDB();
};

bootstrap();

app.listen(PORT);
