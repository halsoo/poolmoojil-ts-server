import Router from 'koa-router';
import createTestData = require('../qa/createTestData');

import { getConnection, Connection } from 'typeorm';
import { Book } from '../models/Book';
import { Gathering } from '../models/Gathering';

const axios = require('axios');
const queryString = require('querystring');
const HttpStatus = require('http-status');

export const apiRouter = new Router();

apiRouter.get('/', (ctx, next) => {
    ctx.body = 'api';
});

apiRouter.get('/books', async (ctx, next) => {
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

apiRouter.get('/maps', async (ctx, next) => {
    const mapRequest = axios.create({
        baseURL: 'https://naveropenapi.apigw.ntruss.com/map-geocode',
        timeout: 1000,
        headers: {
            'X-NCP-APIGW-API-KEY-ID': 'n8zu7htxmz',
            'X-NCP-APIGW-API-KEY': 'u7Vvq1iFYzyORjHnN4AY8gYJbXfOHIDji4iRAHmX',
        },
    });

    try {
        const centerData = await mapRequest.get(
            '/v2/geocode?' + queryString.stringify({ query: '종로구 성균관로 19 지하' }),
        );
        ctx.body = [{ lng: centerData.data.addresses[0].x, lat: centerData.data.addresses[0].y }];
    } catch (err) {
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            message: err.message,
        };
    }
    await next();
});

apiRouter.post('/gatherings', createTestData.TestData.createTestGatherings);
apiRouter.post('/books', createTestData.TestData.createTestBooks);

apiRouter.post('/users', createTestData.TestData.createTestUsers);
