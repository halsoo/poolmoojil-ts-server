import Router from 'koa-router';
import GatheringController from '../controllers/Gathering';
export const GatheringRouter = new Router();
//Routes for the user entity
GatheringRouter.post('/', GatheringController.getGatherings); //Get all users in the database
GatheringRouter.get('/getid/:id', GatheringController.getGatheringID); //Get a single user by id
GatheringRouter.get('/upcoming', GatheringController.getUpcomingGathering);
GatheringRouter.get('/threemonths', GatheringController.getThreeMonthsGathering);
GatheringRouter.get('/test', GatheringController.test);
