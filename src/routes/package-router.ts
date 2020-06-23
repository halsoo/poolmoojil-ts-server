import Router from 'koa-router';
import PackageController from '../controllers/Package';
export const PackageRouter = new Router();
//Routes for the user entity
PackageRouter.post('/', PackageController.getPackages); //Get all users in the database
PackageRouter.get('/getid/:id', PackageController.getPackageID); //Get a single user by id
PackageRouter.get('/getmonthly', PackageController.getPackageMonthly);

PackageRouter.post('/createhistory', PackageController.createPackageHistory);
PackageRouter.post('/gethistories', PackageController.getPackageHistories);
PackageRouter.get('/cancelhistory/:id', PackageController.cancelPackageHistory);
PackageRouter.post('/gethistoriesbyuser', PackageController.getPackageHistoriesByUser);
PackageRouter.post('/gethistorybyordernum', PackageController.getPackageHistoryOrderNum);
PackageRouter.post('/gethistorybyid', PackageController.getPackageHistoryID);
PackageRouter.post('/changetransactionstatus', PackageController.changeTransactionHistory);
PackageRouter.post('/updatepackage', PackageController.updatePackageInfo);

PackageRouter.post('/createsubsc', PackageController.createPackageSubsc);
PackageRouter.post('/getsubscs', PackageController.getPackageSubscs);
PackageRouter.post('/getsubscbyid', PackageController.getPackageSubscID);
PackageRouter.post('/getsubscbyordernum', PackageController.getPackageSubscOrderNum);
PackageRouter.post('/changesubscstatus', PackageController.changeSubscStatus);

PackageRouter.get('/changeoutofstock/:id', PackageController.changeOutOfStock);
PackageRouter.post('/create', PackageController.createPackage);
PackageRouter.post('/edit', PackageController.updatePackage);
PackageRouter.get('/delete/:id', PackageController.deletePackage);
