import Router from 'koa-router';
import BookController from '../controllers/Book';
export const BookRouter = new Router();
//Routes for the user entity
BookRouter.post('/', BookController.getBooks); //Get all users in the database
BookRouter.get('/getid/:id', BookController.getBookID); //Get a single user by id
BookRouter.post('/getcurated', BookController.getBookCurated);
BookRouter.post('/getselected', BookController.getBookSelected);
