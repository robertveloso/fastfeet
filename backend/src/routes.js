import { Router } from 'express';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';
import multer from 'multer';
import multerConfig from './config/multer';
import redisConfig from './config/redis';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DelivererController from './app/controllers/DelivererController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryPendingController from './app/controllers/DeliveryPendingController';
import DeliveryDeliveredController from './app/controllers/DeliveryDeliveredController';
import DeliveryWithDrawController from './app/controllers/DeliveryWithDrawController';
import DeliveryFinishController from './app/controllers/DeliveryFinishController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';
import validateSessionStore from './app/validators/SessionStore';
import validateRecipientStoreOrUpdate from './app/validators/RecipientStoreOrUpdate';
import validateDelivererStoreOrUpdate from './app/validators/DelivererStoreOrUpdate';
import validateDeliveryWithDraw from './app/validators/DeliveryWithDraw';
import validateDeliveryStoreOrUpdate from './app/validators/DeliveryStoreOrUpdate';
import validateDeliveryProblemStore from './app/validators/DeliveryProblemStore';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

const bruteStore = new BruteRedis({
  host: redisConfig.host,
  port: redisConfig.port,
});

const bruteForce = new Brute(bruteStore);

routes.post('/users', validateUserStore, UserController.store);

routes.post(
  '/sessions',
  bruteForce.prevent,
  validateSessionStore,
  SessionController.store
);

routes.get('/deliverer/:id', DeliveryPendingController.index);
routes.get('/deliverer/:id/deliveries', DeliveryDeliveredController.index);
routes.put(
  '/deliverer/:delivererId/delivery/:deliveryId',
  validateDeliveryWithDraw,
  DeliveryWithDrawController.update
);
routes.put(
  '/deliverer/:delivererId/delivery/:deliveryId/finish',
  DeliveryFinishController.update
);

routes.post(
  '/delivery/:id/problems',
  validateDeliveryProblemStore,
  DeliveryProblemController.store
);

routes.get('/deliverers/:id', DelivererController.show);

routes.post('/files', upload.single('file'), FileController.store);

routes.use(authMiddleware);

routes.put('/users', validateUserUpdate, UserController.update);

routes.post(
  '/recipients',
  validateRecipientStoreOrUpdate,
  RecipientController.store
);
routes.put(
  '/recipients/:id',
  validateRecipientStoreOrUpdate,
  RecipientController.update
);
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);
routes.delete('/recipients/:id', RecipientController.destroy);

routes.post(
  '/deliverers',
  validateDelivererStoreOrUpdate,
  DelivererController.store
);
routes.get('/deliverers', DelivererController.index);
routes.put(
  '/deliverers/:id',
  validateDelivererStoreOrUpdate,
  DelivererController.update
);
routes.delete('/deliverers/:id', DelivererController.destroy);

routes.get('/deliveries/problems', DeliveryProblemController.index);
routes.get('/delivery/:id/problems', DeliveryProblemController.show);

routes.post(
  '/deliveries',
  validateDeliveryStoreOrUpdate,
  DeliveryController.store
);
routes.get('/deliveries', DeliveryController.index);
routes.get('/deliveries/:id', DeliveryController.show);
routes.put(
  '/deliveries/:id',
  validateDeliveryStoreOrUpdate,
  DeliveryController.update
);
routes.delete('/deliveries/:id', DeliveryController.destroy);

routes.delete(
  '/problem/:id/cancel-delivery',
  DeliveryProblemController.destroy
);

export default routes;
