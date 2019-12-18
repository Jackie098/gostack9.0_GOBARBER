import { Router } from 'express';
import User from './app/models/User';
import UserController from './app/controllers/userController';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Diego Fernandes',
    email: 'diego@rocketseat.com.br',
    password_hash: '12132133',
  });

  return res.json(user);
});

export default routes;
