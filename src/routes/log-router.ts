import Router from 'koa-router';
import UserController from '../controllers/User';
export const LogRouter = new Router();
//Routes for the user entity
LogRouter.get('/', UserController.getUsers); //Get all users in the database
LogRouter.get('/:id', UserController.getUser); //Get a single user by id

LogRouter.put('/:id', UserController.updateUser); //Update a single user that matches the passed id
LogRouter.delete('/:id', UserController.deleteUser);

LogRouter.post('/login', UserController.logIn);
LogRouter.post('/logout', UserController.logOut);
LogRouter.post('/register', UserController.createUser); //Create a single user in the database
