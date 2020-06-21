import Router from 'koa-router';
import NoticeController from '../controllers/Notice';
export const NoticeRouter = new Router();
//Routes for the user entity
NoticeRouter.post('/', NoticeController.getNotices); //Get all users in the database
NoticeRouter.get('/getid/:id', NoticeController.getNoticeID); //Get a single user by id
NoticeRouter.post('/create', NoticeController.createNotice);
NoticeRouter.post('/edit', NoticeController.editNotice);
NoticeRouter.get('/delete/:id', NoticeController.deleteNotice);
