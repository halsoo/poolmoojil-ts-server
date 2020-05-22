import Router from 'koa-router';
import createTestData = require('../qa/createTestData');

import { getConnection, Connection, AdvancedConsoleLogger } from 'typeorm';

import { LogRouter } from './log-router';
import { GatheringRouter } from './gathering-router';
import { PackageRouter } from './package-router';
import { BookRouter } from './book-router';
import { GoodRouter } from './good-router';

import { About } from '../models/About';
import { Place } from '../models/Place';

const HttpStatus = require('http-status');

export const apiRouter = new Router();

apiRouter.get('/', (ctx, next) => {
    ctx.body = 'api';
});

apiRouter.use('/users', LogRouter.routes());
apiRouter.use('/gathering', GatheringRouter.routes());
apiRouter.use('/package', PackageRouter.routes());
apiRouter.use('/book', BookRouter.routes());
apiRouter.use('/good', GoodRouter.routes());

apiRouter.get('/aboutTexts', async (ctx, next) => {
    try {
        const aboutTexts = await getConnection()
            .createQueryBuilder()
            .select('abouts')
            .from(About, 'abouts')
            .where('abouts.isShow = :value', { value: true })
            .getMany();

        ctx.body = aboutTexts;
    } catch (err) {
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            message: err.message,
        };
    }
    await next();
});

apiRouter.get('/places', async (ctx, next) => {
    try {
        const places = await getConnection()
            .createQueryBuilder()
            .select('places')
            .from(Place, 'places')
            .getMany();

        ctx.body = places;
    } catch (err) {
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            message: err.message,
        };
    }
    await next();
});

// apiRouter.post('/gatherings', createTestData.TestData.createTestGatherings);
// apiRouter.post('/books', createTestData.TestData.createTestBooks);

// apiRouter.post('/curation', createTestData.TestData.createTestCuration);

// apiRouter.post('/places', createTestData.TestData.createPlaces);
// apiRouter.post('/aboutTexts', createTestData.TestData.createAboutTexts);
// apiRouter.post('/testImages', createTestData.TestData.createTestImages);
// apiRouter.post('/goods', createTestData.TestData.createTestGoods);
// apiRouter.post('/testPackages', createTestData.TestData.createTestPackages);
