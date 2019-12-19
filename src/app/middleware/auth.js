/* eslint-disable no-console */
/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // Pega uma função callback(ultrapassado) e me permite utilizar nela async/await

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' '); // Este método divide a string (bearer -token-) por cada espaço e aloca em um vetor
  // Com a desestruturação eu estou utilizando apenas o segundo valor do vetor que é exatamente o token, tendo em vista que o primeiro valor é o 'bearer'

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    console.log(decoded);
  } catch (err) {
    // Se retornar erro é pq o token é inválido
    res.status(401).json({ error: 'Token Invalid' });
  }

  return next();
};
