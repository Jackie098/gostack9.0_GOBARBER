// Contém configurações na parte de autenticação de usuários

export default {
  secret: process.env.APP_SECRET,
  expiresIn: '7d',
};
