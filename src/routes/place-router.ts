import Router from 'koa-router';
import PlaceController from '../controllers/Place';
export const PlaceRouter = new Router();
//Routes for the user entity
PlaceRouter.get('/', PlaceController.getPlaces); //Get all users in the database
PlaceRouter.get('/getplace/:id', PlaceController.getPlaceID); //Get a single user by id
PlaceRouter.post('/create', PlaceController.createPlace);
PlaceRouter.post('/edit', PlaceController.updatePlace);
PlaceRouter.get('/delete/:id', PlaceController.deletePlace);
