import Router from 'koa-router';
import GatheringController from '../controllers/Gathering';
export const GatheringRouter = new Router();
//Routes for the user entity

GatheringRouter.post('/createhistory', GatheringController.createGatheringHistory);
GatheringRouter.post('/gethistories', GatheringController.getGatheringHistories);
GatheringRouter.post('/gethistorybyordernum', GatheringController.getGatheringOrderNum);
GatheringRouter.post('/getpeople', GatheringController.getGatheringPeople);
GatheringRouter.post('/updateshowup', GatheringController.updateShowUp);

GatheringRouter.post('/', GatheringController.getGatherings); //Get all users in the database
GatheringRouter.get('/getid/:id', GatheringController.getGatheringID); //Get a single user by id
GatheringRouter.get('/upcoming', GatheringController.getUpcomingGathering);
GatheringRouter.get('/threemonths', GatheringController.getThreeMonthsGathering);

GatheringRouter.post('/createhistory', GatheringController.createGatheringHistory);
GatheringRouter.post('/gethistories', GatheringController.getGatheringHistories);
GatheringRouter.post('/gethistorybyordernum', GatheringController.getGatheringOrderNum);

GatheringRouter.post('/create', GatheringController.createGathering);
GatheringRouter.post('/edit', GatheringController.updateGathering);
GatheringRouter.get('/changeisover/:id', GatheringController.changeIsOver);
GatheringRouter.get('/delete/:id', GatheringController.deleteGathering);
