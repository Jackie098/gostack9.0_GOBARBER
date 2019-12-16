module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: '1234',
  database: 'gobarber',
  define: {
    timestamp: true, // /Com isso, eu crio as colunas : 'createAt' e 'updateAt' que respectivamente amarzenarão a data de criação e de última alteração da tabela correspondente
    underscored: true,
    underscoredAll: true, // /Passo para o sequelize que eu quero utilizar a padronização de tabelas através da padronização UNDERSCORED
  },
};
