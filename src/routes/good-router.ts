import Router from 'koa-router';
import GoodController from '../controllers/Good';
export const GoodRouter = new Router();
//Routes for the user entity
GoodRouter.post('/', GoodController.getGoods); //Get all users in the database
GoodRouter.get('/getid/:id', GoodController.getGoodID); //Get a single user by id
