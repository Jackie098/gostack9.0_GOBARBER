/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import { Router } from 'express';

import UserController from './app/controllers/UserController';
import Session from './app/controllers/SessionController';
import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/Sessions', Session.store);

routes.use(authMiddleware); // Colocando nesta posição, mesmo sendo um middleware global, apenas as rotas seguintes o enxergarão

routes.put('/users', UserController.update);

export default routes;
