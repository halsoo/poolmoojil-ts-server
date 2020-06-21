import Router from 'koa-router';
import AboutController from '../controllers/About';
export const AboutRouter = new Router();
//Routes for the user entity
AboutRouter.get('/', AboutController.getTexts); //Get all users in the database
AboutRouter.get('/gettext/:id', AboutController.getTextID); //Get a single user by id
AboutRouter.post('/create', AboutController.createText);
AboutRouter.post('/edit', AboutController.updateText);
AboutRouter.get('/delete/:id', AboutController.deleteText);
