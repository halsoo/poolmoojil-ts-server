import Router from 'koa-router';
import UserController from '../controllers/User';
export const LogRouter = new Router();
//Routes for the user entity
LogRouter.post('/', UserController.getUsers); //
LogRouter.get('/getuser/:id', UserController.getUser);
LogRouter.get('/getbycookie', UserController.getUserCookie);
LogRouter.get('/getemail/:email', UserController.getEmail);

LogRouter.delete('/:id', UserController.deleteUser); //

LogRouter.post('/updatemembership', UserController.updateMembership); //
LogRouter.post('/login', UserController.logIn);
LogRouter.post('/logout', UserController.logOut);
LogRouter.post('/register', UserController.createUser);
LogRouter.post('/update', UserController.updateUser); //

LogRouter.post('/cartin', UserController.cartIn); //
LogRouter.post('/cartout', UserController.cartOut); //
LogRouter.post('/cartclear', UserController.cartClear); //
LogRouter.get('/getcartcookie', UserController.getCart); //
