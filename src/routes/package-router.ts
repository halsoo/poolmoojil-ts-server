import Router from 'koa-router';
import PackageController from '../controllers/Package';
export const PackageRouter = new Router();
//Routes for the user entity
PackageRouter.post('/', PackageController.getPackages); //Get all users in the database
PackageRouter.get('/getid/:id', PackageController.getPackageID); //Get a single user by id
PackageRouter.get('/getmonthly', PackageController.getPackageMonthly);
