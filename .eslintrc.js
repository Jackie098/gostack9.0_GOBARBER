module.exports = {
  env: {
    es6: true,
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  plugins:[
    'prettier'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier": "error",   // Para me retornar um erro sempre que que infligir as restrições deste módulo (prettier)
    "class-method-use-this": "off", //Me permite não utilzar 'this' nas fnções das classes
    "no-param-reassign": "off",     //Desabiliza a padronização que me impede de alterar os parâmetros que recebo,
    "camalcase": "off",             // Ao invés de declarar "variavelAssim", agora posso declarar "variavel_assim"
    "no-unused-vars": ["error", { "argsIgnorePattern": "next"} ]   //Me permite deixar no código variáveis que não irei utilizar
  },
};
