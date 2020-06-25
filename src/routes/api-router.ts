import Router from 'koa-router';
import axios from 'axios';
//import createTestData = require('../qa/createTestData');
import AWS from 'aws-sdk';
import multer from 'koa-multer';
import multerS3 from 'multer-s3';
import path from 'path';

import { getConnection, getManager, Repository } from 'typeorm';

import { LogRouter } from './log-router';
import { GatheringRouter } from './gathering-router';
import { PackageRouter } from './package-router';
import { BookRouter } from './book-router';
import { GoodRouter } from './good-router';
import { NoticeRouter } from './notice-router';
import { OrderHistoryRouter } from './orderHistory-router';
import { PlaceRouter } from './place-router';
import { AboutRouter } from './about-router';

import { About } from '../models/About';
import { Place } from '../models/Place';
import { Image } from '../models/Image';

const addressKey = process.env.ADDRESS_KEY;

export const apiRouter = new Router();

apiRouter.use('/users', LogRouter.routes());
apiRouter.use('/gathering', GatheringRouter.routes());
apiRouter.use('/package', PackageRouter.routes());
apiRouter.use('/book', BookRouter.routes());
apiRouter.use('/good', GoodRouter.routes());
apiRouter.use('/notice', NoticeRouter.routes());
apiRouter.use('/orderhistory', OrderHistoryRouter.routes());
apiRouter.use('/places', PlaceRouter.routes());
apiRouter.use('/aboutTexts', AboutRouter.routes());

apiRouter.post('/getaddress', async (ctx: any, next) => {
    try {
        const req = ctx.request.body;
        console.log(req);
        const res = await axios.get(
            `http://www.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${addressKey}&currentPage=${
                req.page
            }&countPerPage=5&keyword=${encodeURI(req.query)}&resultType=json`,
        );
        ctx.body = res.data;
    } catch (err) {
        ctx.status = 500;
        console.log(err);
    }

    next();
});

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: 'ap-northeast-2',
});

const s3Storage: any = multerS3({
    s3: s3,
    bucket: 'poolmoojil-images',
    key: (reqt, file, cb) => {
        let extension = path.extname(file.originalname);
        let basename = path.basename(file.originalname, extension);
        cb(null, `images/${basename}-${Date.now()}${extension}`);
    },
    acl: 'public-read',
    serverSideEncryption: 'AES256',
});

apiRouter.post(
    '/uploadimage',
    multer({ storage: s3Storage }).single('file'),
    async (ctx: any, next) => {
        const body = ctx.req.file;

        ctx.status = 200;
        ctx.body = body;
    },
);

apiRouter.post(
    '/uploadimagemult',
    multer({ storage: s3Storage }).array('file'),
    async (ctx: any, next) => {
        const body = ctx.req.file;
        console.log(body);

        ctx.status = 200;
        ctx.body = body;
    },
);
