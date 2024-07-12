const { Sequelize } = require('sequelize');
const path = require('path');

//base do node/sequelize - vídeo 2
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database', 'database.sqlite'), //diretório onde guardar temporariamente na memória
  logging: false, 
});

module.exports = sequelize;
