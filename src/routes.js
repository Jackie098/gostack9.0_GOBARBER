/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import { Router } from 'express';

import UserController from './app/controllers/UserController';
import Session from './app/controllers/SessionController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/Sessions', Session.store);

export default routes;
