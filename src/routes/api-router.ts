import Router from 'koa-router';
import createTestData = require('../qa/createTestData');

import { getConnection, Connection, AdvancedConsoleLogger } from 'typeorm';

import { LogRouter } from './log-router';

import { Book } from '../models/Book';
import { Gathering } from '../models/Gathering';
import { About } from '../models/About';
import { Place } from '../models/Place';

const HttpStatus = require('http-status');

export const apiRouter = new Router();

apiRouter.get('/', (ctx, next) => {
    ctx.body = 'api';
});

apiRouter.use('/users', LogRouter.routes());

apiRouter.get('/books', async (ctx, next) => {
    if (ctx.request.user) {
        try {
            const books = await getConnection()
                .createQueryBuilder()
                .select('books')
                .from(Book, 'books')
                .getMany();

            ctx.body = books;
        } catch (err) {
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                message: err.message,
            };
        }
    }
    await next();
});

apiRouter.get('/gatherings', async (ctx, next) => {
    try {
        const gatherings = await getConnection()
            .createQueryBuilder()
            .select('gatherings')
            .from(Gathering, 'gatherings')
            .getMany();

        ctx.body = gatherings;
    } catch (err) {
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            message: err.message,
        };
    }
    await next();
});

apiRouter.get('/store', async (ctx, next) => {
    const store = 'store';
    ctx.status = HttpStatus.OK;
    ctx.body = store;
    await next();
});

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

apiRouter.post('/user', createTestData.TestData.createTestUsers);

// apiRouter.post('/places', createTestData.TestData.createPlaces);
// apiRouter.post('/aboutTexts', createTestData.TestData.createAboutTexts);
