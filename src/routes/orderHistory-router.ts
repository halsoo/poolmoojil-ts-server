import Router from 'koa-router';
import OrderHistoryController from '../controllers/OrderHistory';
export const OrderHistoryRouter = new Router();
//Routes for the user entity
OrderHistoryRouter.post('/create', OrderHistoryController.createOrderHistory); //Get all users in the database
OrderHistoryRouter.post('/getbyordernum', OrderHistoryController.getOrderHistoryOrderNum); //Get a single user by id
OrderHistoryRouter.post('/', OrderHistoryController.getOrderHistories);
OrderHistoryRouter.post('/gethistoriesbyuser', OrderHistoryController.getOrderHistoriesByUser);
OrderHistoryRouter.post('/changetransactionstatus', OrderHistoryController.changeTransactionStatus);
OrderHistoryRouter.get('/cancelorder/:orderNum', OrderHistoryController.cancelOrder);
// OrderHistoryRouter.get('/threemonths', OrderHistoryController.getThreeMonthsOrderHistory);
