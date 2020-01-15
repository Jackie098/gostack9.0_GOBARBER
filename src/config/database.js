require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  define: {
    timestamp: true, // Com isso, eu crio as colunas : 'createAt' e 'updateAt' que respectivamente amarzenarão a data de criação e de última alteração da tabela correspondente
    underscored: true,
    underscoredAll: true, // Passo para o sequelize que eu quero utilizar a padronização de tabelas através da padronização UNDERSCORED
  },
};
